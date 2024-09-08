import express from "express";
import { getUserByEmail, setRole } from "./controller.js";
const router = express.Router();
router.put("/role", setRole);
router.get("/:email", getUserByEmail);
export default router;
