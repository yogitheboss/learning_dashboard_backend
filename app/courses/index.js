import express from "express";
import {
  getCourses,
  addCourse,
  getUserEnrolledCourses,
  getUserCourses,
  enrollCourse,
  unenrollCourse,
} from "./controller.js";

// Define Express router
const router = express.Router();
router.post("/", addCourse);
router.get("/user/:id", getUserCourses);
router.post("/enroll/:id", enrollCourse);
router.post("/unenroll/:id", unenrollCourse);
router.get("/enrolled/:id", getUserEnrolledCourses);
router.get("/", getCourses);
export default router;
