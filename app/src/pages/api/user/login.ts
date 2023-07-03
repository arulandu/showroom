import { db } from "@/lib/db/db";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.body.session.user.email;
  const name = req.body.session.user.name;
  const token = req.body.token.sub;

  let user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    try {
      user = await db.user.create({
        data: {
          name: name,
          email: email,
        },
      });
    } catch (e) {
      console.log(e);
      return res.status(500).send("User creation failed.");
    }
  }

  let webSession = await db.webSession.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!webSession) {
    webSession = await db.webSession.create({
      data: {
        userId: user.id,
        token: token,
      },
    });
  }

  return res.status(200).json({
    user,
    webSession,
  });
}
/*
app.post("/", async (req, res) => {
  try {
    const operator = await db.operator.create({
      data: {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Operator creation failed.");
  }

  return res.status(200).json({
    operator,
  });
});

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

app.post("/login", async (req, res) => {
  
});
*/
export default handler;