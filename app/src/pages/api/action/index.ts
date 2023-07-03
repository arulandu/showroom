import { authorize } from "@/lib/api/authorize";
import { db } from "@/lib/db/db";
import { ActionType } from "@prisma/client";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if(req.method == 'GET'){
    const {authorized, webSession, user} = await authorize(req, res)
    if(!authorized) return res.status(401)
    try {
      const actions = await db.action.findMany({
        where: {
          createdAt: {
            gte: req.query.startDate as string,
            lte: req.query.endDate as string
          },
          userId: user.admin ? undefined : user.id
        },
        include: {
          user: {
            select: {
              name: true
            }
          },
          product: {
            select: {
              name: true
            }
          }
        }
      })
      return res.status(200).json({
        actions,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send("User creation failed.");
    }

  } else if (req.method == 'POST') {
    const {authorized, webSession, user} = await authorize(req, res)
    if(!authorized) return res.status(401)

    try {
      const action = await db.action.create({
        data: {
          type: req.body.type, 
          quantity: req.body.quantity, 
          money: req.body.money, 
          productId: req.body.productId, 
          userId: user.id,
          createdAt: new Date()
        },
        include: {
          product: {
            select: {
              quantity: true
            }
          }
        }
      });

      const product = await db.product.update({
        where: {
          id: action.productId,
        },
        data: {
          quantity: action.product.quantity + action.quantity*(action.type == ActionType.BUY ? 1 : (action.type == ActionType.SELL ? -1 : 0))
        }
      })

      return res.status(200).json({
        action,
        product
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send("User creation failed.");
    }
  }
}

export default handler;