import axios from "axios";
import { auth } from "express-oauth2-jwt-bearer";
import { addUser } from "../utils/addUser.js";
import dotenv from "dotenv";
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
    const userInfo = await axios.get(`https://${domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    await addUser(
      userInfo.data.name,
      userInfo.data.email,
      userInfo.data.nickname,
      userInfo.data.picture
    );
    const user = await UserModel.findOne({ email: userInfo.data.email });
    req.user =  user;
    next();
  } catch (error) {
    next(error);
  }
};
