import mongoose from "mongoose";
import server from "./server.js";
const MONGO_URI = process.env.MONGO_URI;
const PORT = parseInt(process.env.PORT, 10);
mongoose
  .connect(MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
    console.log("Connection successful");
  })
  .catch((e) => {
    console.log("No connection");
  });
