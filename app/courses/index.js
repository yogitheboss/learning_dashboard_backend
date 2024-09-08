import express from "express";
import { getCourses, addCourse } from "./controller.js";
const router = express.Router();
router.post("/", addCourse);
router.get("/", getCourses);
export default router;
