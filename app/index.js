import express from "express";
import userRouter from "./user/index.js";
import courseRouter from "./courses/index.js"
const apiRouter = express.Router();
apiRouter.use("/user", userRouter);
apiRouter.use("/courses", courseRouter);
export default apiRouter;
