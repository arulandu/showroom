import type { NextPage } from "next";
import { Layout } from "@/components/layout";
import Image from "next/image";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Header, { notify, ToastType } from "@/components/header";
import { Footer } from "@/components/footer";
import React from "react";
import { handleInputChange } from "@/lib/handleInputChange";
import { InputField } from "@/components/InputField";
import OutlineButton from "@/components/OutlineButton";
import { useToasts } from "@/components/ToastProvider";
import { useSession } from 'next-auth/react'
import Background from '@/components/Background';
import SiteLink from "@/components/SiteLink";
import { TabSelect } from "@/components/TabSelect";
import { Dropdown } from "@/components/Dropdown";

const PanelButton = ({ name = "", className = "", onClick = () => { } }) => {
  return (
    <button onClick={onClick} className={`mt-8 group p-2 border-solid border bg-white bg-opacity-0 hover:bg-opacity-5 border-white transition-all ${className}`}>{name} <span className="ml-0 group-hover:ml-1 transition-all">{"->"}</span></button>
  );
}

const ActionSection = () => {
  const { toastDispatch } = useToasts()
  const [input, setInput] = useState({
    product: 0,
    type: "BUY",
    quantity: "0",
    money: "0"
  })

  const [products, setProducts] = useState([])
  const { data: session } = useSession()

  const getProducts = async () => {
    const res = await (await fetch('/api/product', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as any).token.sub}`
      }
    })).json()
    setProducts(res.products)
  }

  const submit = async () => {
    try {
      notify(toastDispatch, "", "Recording action...", ToastType.DEFAULT)
      const res = await (await fetch('/api/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any).token.sub}`
        },
        body: JSON.stringify({
          type: input.type,
          quantity: parseInt(input.quantity),
          money: parseFloat(input.money),
          productId: products[input.product].id,
        })
      })).json()
      notify(toastDispatch, "", `Recorded action: ${input.type} ${products[input.product].name} (${input.quantity}) for ₹${input.money}`, ToastType.SUCCESS)
    } catch (e) {
      console.log(e)
      notify(toastDispatch, "", "Failed to record action", ToastType.DANGER)
    }
  }

  useEffect(() => {
    if (!session) return;
    getProducts()
  }, [session])



  return (
    <>
      {session ?
        <div className="mx-auto max-w-xl bg-blue bg-opacity-5 p-2">
          <h3 className="text-2xl font-semibold">Execute Action</h3>
          <Dropdown id="product" label="Product" options={products.map((p, i) => { return { label: p.name, value: i } })} value={input.product} onChange={(e) => handleInputChange(e, input, setInput)} className='mt-2 text-navy' />
          <Dropdown id="type" label="Type" options={[{ label: 'Buy', value: 'BUY' }, { label: 'Sell', value: 'SELL' }]} value={input.type} onChange={(e) => handleInputChange(e, input, setInput)} className='mt-2 text-navy' />
          <InputField id="quantity" name="Quantity" value={input.quantity} onChange={(e) => handleInputChange(e, input, setInput)} />
          <InputField id="money" name="Money (₹)" value={input.money} onChange={(e) => handleInputChange(e, input, setInput)} />
          <PanelButton name="Submit" onClick={submit} />
        </div>
        : null}
    </>

  );
}

const ProductSection = () => {
  const { toastDispatch } = useToasts()
  const { data: session } = useSession()
  const [input, setInput] = useState({
    name: "",
    quantity: "0"
  })

  const [products, setProducts] = useState([])

  const create = async () => {
    try {
      notify(toastDispatch, "", "Creating product...", ToastType.DEFAULT)
      const res = await (await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(session as any).token.sub}`
        },
        body: JSON.stringify({
          name: input.name,
          quantity: parseInt(input.quantity)
        })
      })).json()
      await getProducts()
      notify(toastDispatch, "", `Created product: ${res.product.name} (${res.product.quantity})`, ToastType.SUCCESS)
    } catch (e) {
      console.log(e)
      notify(toastDispatch, "", "Failed to create product", ToastType.DANGER)
    }
  }

  const getProducts = async () => {
    notify(toastDispatch, "", "Loading inventory...", ToastType.DEFAULT)
    const res = await (await fetch('/api/product', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as any).token.sub}`
      }
    })).json()
    setProducts(res.products)
    notify(toastDispatch, "", "Loaded inventory!", ToastType.SUCCESS)
  }

  useEffect(() => {
    if (!session) return;
    getProducts()
  }, [session])

  return (
    <>
      <div className="mx-auto max-w-xl bg-blue bg-opacity-5 p-2">
        <h3 className="text-2xl font-semibold">Product Creation</h3>
        <InputField id="name" name="Name" value={input.name} onChange={(e) => handleInputChange(e, input, setInput)} />
        <InputField id="quantity" name="Quantity" value={input.quantity} onChange={(e) => handleInputChange(e, input, setInput)} />
        <PanelButton name="Create" onClick={create} />
      </div>
      <div className="mt-4 mx-auto max-w-xl bg-blue bg-opacity-5 p-2">
        <h3 className="text-2xl font-semibold">Inventory</h3>
        <span className="mt-4 block w-full h-[2px] bg-blue bg-opacity-10"></span>

        {products.map(product =>
          <div key={product.id}>
            <p className="my-1">{product.name} ({product.quantity})</p>
            <span className="block w-full h-[2px] bg-blue bg-opacity-10"></span>
          </div>
        )}
      </div>
    </>
  );
}

const AdminSection = () => {
  const { toastDispatch } = useToasts()
  const { data: session } = useSession()

  const timezone = "IST";

  let d = new Date()
  d.setFullYear(2000)
  const [input, setInput] = useState({
    startDate: d,
    endDate: new Date()
  })

  const toISO = (s) => {
    const d = new Date(s)
    return d.toISOString();
  }

  const [actions, setActions] = useState([])
  const profit = actions.map(a => (a.type === "BUY" ? -1 : 1) * a.money).reduce((a, b) => a + b, 0);

  const getActions = async () => {
    notify(toastDispatch, "", "Loading actions...", ToastType.DEFAULT)
    const res = await (await fetch('/api/action?' + new URLSearchParams({
      startDate: toISO(input.startDate),
      endDate: toISO(input.endDate)
    }), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(session as any).token.sub}`
      }
    })).json()
    setActions(res.actions)
    notify(toastDispatch, "", "Loaded actions!", ToastType.SUCCESS)
  }

  return (
    <>
      <div className="mx-auto max-w-2xl bg-blue bg-opacity-5 p-2">
        <h3 className="text-2xl font-semibold">Actions</h3>
        <span className="mt-4 mb-1 block w-full h-[2px] bg-blue bg-opacity-10"></span>
        <InputField id="startDate" name="Start Date" value={input.startDate} onChange={(e) => handleInputChange(e, input, setInput)} />
        <InputField id="endDate" name="End Date" value={input.endDate} onChange={(e) => handleInputChange(e, input, setInput)} />
        <PanelButton name="Fetch" onClick={getActions} />
        {actions.length > 0 ?
          <div className="">
            <span className="my-4 block w-full h-[2px] bg-blue bg-opacity-10"></span>
            <p className="font-bold">Net Profit: <span className={`${profit >= 0 ? "text-green-400" : "text-red-400"}`}>{profit < 0 ? "-" : ""} ₹{Math.abs(profit)}</span></p>
            <span className="my-1 block w-full h-[2px] bg-blue bg-opacity-10"></span>
            {actions.map(action =>
              <div key={action.id}>
                <p className=" font-normal">{action.user.name} | {(new Date(action.createdAt)).toString()}</p>
                <p className="font-extralight">₹{action.money} to {action.type} {action.product.name} ({action.quantity})</p>
                <span className="my-1 block w-full h-[2px] bg-blue bg-opacity-10"></span>
              </div>
            )}
          </div>
          : null
        }
      </div>
    </>
  );
}


const Dashboard: NextPage<any> = ({ officers }) => {
  const { toastDispatch } = useToasts();

  const { data: session } = useSession();
  const user: any = session ? session.user : null

  const [input, setInput] = useState({ tab: 'action' })
  const tabs = [
    { label: 'Action', value: 'action' },
    { label: 'Product', value: 'product' },
    user?.admin ? { label: 'Admin', value: 'admin' } : null,
  ].filter(v => v)

  const tabMap = {
    'action': <ActionSection />,
    'product': <ProductSection />,
    'admin': <AdminSection />
  }

  return (
    <Layout>
      <Header />
      <div className='relative w-full m-0 h-screen'>
        <Background className="" />
        <main className='relative w-full min-h-screen bg-transparent'>
          <div className="relative min-h-screen py-16 sm:py-24 px-4 sm:px-12 lg:px-24 text-white">
            {user ?
              <>
                <div className="h-screen flex flex-col items-center justify-center">
                  <h1 className='mt-4 text-white text-center text-4xl'>Dashboard{user.admin ? ' (Admin)' : ''}</h1>
                  <p className='text-white text-center text-xl font-extralight mt-4'>Welcome <span className="font-medium">{user.name}</span>!</p>
                  <TabSelect id="tab" options={tabs} value={input.tab} onChange={(x) => setInput({ ...input, tab: x })} className='mt-8 flex-col sm:flex-row' />
                </div>
                {input.tab ? tabMap[input.tab] : null}
              </>
              : null}
          </div>
          <Footer />
        </main>
      </div >
    </Layout >
  );
};


export default Dashboard;
