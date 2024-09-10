import axios from "axios";
import { auth } from "express-oauth2-jwt-bearer";
import dotenv from "dotenv";
import { UserModel } from "../models/user.js";

dotenv.config();

const domain = process.env.AUTH0_DOMAIN;
const aud = process.env.AUTH0_AUDIENCE;

export const checkJwt = auth({
  audience: aud,
  issuerBaseURL: `https://${domain}/`,
  tokenSigningAlg: "RS256",
});

export const attachUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];

    // Fetch user data from Auth0 if not in session
    const userInfo = await axios.get(`https://${domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = await UserModel.findOne({ email: userInfo.data.email });
    if(!user) {
      console.log("user", userInfo.data);
      const newUser = new UserModel({
        email: userInfo.data.email,
        name: userInfo.data.name,
        userName: userInfo.data.nickname,
        picture: userInfo.data.picture,
        role: "",
      });

      await newUser.save();
      req.user = newUser;
      return next();
    }
    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
