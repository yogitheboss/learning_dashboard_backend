import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import helmet from "helmet";
dotenv.config();
import apiRouter from "./app/index.js";
import {attachUser, checkJwt} from "./middlewares/checkJwt.js";
import session from "express-session";
const app = express();
const server = createServer(app);

app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
    },
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'none'"],
        "frame-ancestors": ["'none'"],
      },
    },
    frameguard: {
      action: "deny",
    },
  })
);


// Apply CORS middleware before other middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

// Parse JSON bodies
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);
app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});

// Public route for testing
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Apply authentication middleware and then API routes
app.use("/api", checkJwt, attachUser,apiRouter);

// app.use(errorHandler);
// app.use(notFoundHandler);


export default server;
