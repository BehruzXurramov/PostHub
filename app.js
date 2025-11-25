import dotenv from "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import router from "./src/routes/index.routes.js";
import errorHandler from "./src/middleware/errorHandler.js";

const PORT = process.env.PORT;
const DBURL = process.env.DBURL;

const app = express();

app.use(express.json());
app.use("/api", router);

app.use(errorHandler);
async function start() {
  try {
    await mongoose.connect(DBURL);
    app.listen(PORT, () => {
      console.log(`Server is running. PORT: ${PORT}`);
    });
  } catch (error) {}
}

start();
