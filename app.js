import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()
import { postRouter } from "./routers/post.route.js";
import fileUpload from "express-fileupload";
import { authRouter } from "./routers/auth.route.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/error.middleware.js";
import cors from "cors"

const app = express();

app.use(cors({
  credentials: true,
  origin: process.env.CLIENT_URL
}))
app.use(express.json())
app.use(cookieParser({}))
app.use(express.static("static"))
app.use(fileUpload())

// Routes
app.use("/api/post", postRouter)
app.use("/api/auth", authRouter)

app.use(errorMiddleware)

const PORT = process.env.PORT | 8080;
const bootstrap = async () => {
  try {
    await mongoose.connect(process.env.DB_URL).then(() => console.log("Success on connecting"));
    app.listen(PORT, () => console.log(`Listening on - http://localhost:${PORT}`))
  } catch (error) {
    console.log(`Error connecting DB: ${error}`)
  }
}
bootstrap()