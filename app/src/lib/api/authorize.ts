import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {db} from '@/lib/db/db'

export const authorize = async (req: NextApiRequest, res: NextApiResponse, admin=false) => {  
  let authorization = null
  if(!authorization) authorization = req.headers.authorization
  if(!authorization && req.cookies.auth) {
    const auth = JSON.parse(req.cookies.auth)
    if(auth) authorization = `Bearer ${auth.access_token}`
  }
  const token = authorization.replace("Bearer ", "")
  const webSession = await db.webSession.findUnique({
    where: {
      token: token
    },
  })

  let authorized = webSession != null
  
  const user = await db.user.findUnique({
    where: {
      id: webSession.userId
    }
  })

  if(admin && !user.admin) authorized = false;

  return {
    authorized,
    webSession,
    user
  }
}