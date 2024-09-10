import axios from 'axios';
import { auth } from 'express-oauth2-jwt-bearer';
import dotenv from 'dotenv';
import { UserModel } from '../models/user.js';

dotenv.config();

const domain = process.env.AUTH0_DOMAIN;
const aud = process.env.AUTH0_AUDIENCE;

export const checkJwt = auth({
  audience: aud,
  issuerBaseURL: `https://${domain}/`,
  tokenSigningAlg: 'RS256',
});

export const attachUser = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];

    // Check if user data is in the session
    if (req.session.user) {
      req.user = req.session.user;
      return next();
    }

    // Fetch user data from Auth0 if not in session
    const userInfo = await axios.get(`https://${domain}/userinfo`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const user = await UserModel.findOne({ email: userInfo.data.email });

    if (user) {
      // Save user data in session
      req.session.user = user;
      req.user = user;
    } else {
      // Handle the case where user is not found in the database
      req.session.user = null;
    }

    next();
  } catch (error) {
    next(error);
  }
};
