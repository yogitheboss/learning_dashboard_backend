import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import apiRouter from "./app/index.js";
import { auth } from "express-oauth2-jwt-bearer";
dotenv.config();

const jwtCheck = auth({
  audience: "unique_identifier",
  issuerBaseURL: "https://dev-gxqdrfbsx85fmlo6.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

const app = express();
const server = createServer(app);
app.use(express.json());
app.use("/api", jwtCheck, apiRouter);
const allowedOrigins = ["http://localhost:5173"];

app.use(
  cors({
    origin: function (origin, callback) {
      const requestOrigin = origin || "Unknown origin";
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
    maxFileSize: 1073741824, // 1 GB in bytes
    maxFieldsSize: 1073741824, // 1 GB in bytes
  })
);



// test route
app.get("/", (req, res) => {
  res.send("Hello World");
});


// non test route
server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
