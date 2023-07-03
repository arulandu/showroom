import { authorize } from "@/lib/api/authorize";
import { db } from "@/lib/db/db";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method == 'GET'){
    try {
      const {authorized, webSession, user} = await authorize(req, res, false)
      if(!authorized) return res.status(401)
      
      const products = await db.product.findMany({where: {}})
      return res.status(200).json({
        products
      })

    } catch (e) {
      console.log(e)
      return res.status(500).send("Couldn't get products.")
    }
  } else if (req.method == 'POST') {
    try {
      const {authorized, webSession, user} = await authorize(req, res, true)
      if(!authorized) return res.status(401)

      const product = await db.product.create({
        data: {
          name: req.body.name,
          quantity: req.body.quantity
        },
      });

      return res.status(200).json({
        product,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send("Product creation failed.");
    }
  }
}

export default handler;