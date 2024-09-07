import express from "express";
import { UserModel } from "../models/user.js";
const router = express.Router();
router.get("/", async (req, res) => {
  res.json({
    user: req.user,
    message: "user added",
  });
});

export default router;
