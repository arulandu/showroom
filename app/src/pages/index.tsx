import type { NextPage } from "next";
import { Layout } from "@/components/layout";
import Image from "next/image";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Header, { notify, ToastType } from "@/components/header";
import { Footer } from "@/components/footer";
import Background from "@/components/Background";
import React from "react";
import { handleInputChange } from "@/lib/handleInputChange";
import { InputField } from "@/components/InputField";
import OutlineButton from "@/components/OutlineButton";
import { useToasts } from "@/components/ToastProvider";
import { useSession } from 'next-auth/react'

const PageButton = ({ name = "", link, target="_self", className = "" }) => {
  return (
    <a href={link} target={target} className={`mt-8 group p-2 border-solid border bg-white bg-opacity-0 hover:bg-opacity-5 border-white transition-all ${className}`}>{name} <span className="ml-0 group-hover:ml-1 transition-all">{"->"}</span></a>
  );
}

const Home: NextPage<any> = ({ officers }) => {
  return (
    <Layout>
      <div className='relative w-full m-0 h-screen'>
        <Background className="" />
        <main className='relative w-full h-screen bg-transparent text-white '>
          <div className="px-8 h-full flex flex-col justify-center items-center ">
            <div className="max-w-xl text-center">
              <h1 className="text-6xl font-extrabold">jo·ven mo·tors</h1>
              <p className="mt-4 text-2xl font-normal">A Yamaha motorcycle shop founded by Franklin Desai in Tamil Nadu, India</p>
              <PageButton name="Dashboard" link="/dashboard" className="block w-fit mt-4 mx-auto"/>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </Layout>
  );
};


export default Home;
