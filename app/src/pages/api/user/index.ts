import { authorize } from "@/lib/api/authorize";
import { db } from "@/lib/db/db";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == 'POST') {
    try {
      const user = await db.user.create({
        data: {
          name: req.body.name,
          email: req.body.email,
        },
      });


      return res.status(200).json({
        user,
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send("User creation failed.");
    }
  }
}

/*
app.post("/update", async (req, res) => {
  const { authorized, webSession } = await authorize(req, res);
  if (!authorized) return res.status(401).send(null);
  try {
    const operator = await db.operator.update({
      where: {
        id: webSession.operatorId,
      },
      data: {
        phoneNumber: req.body.phone,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Operator update failed.");
  }

  return res.status(200).json({
    operator,
  });
});
*/

export default handler;