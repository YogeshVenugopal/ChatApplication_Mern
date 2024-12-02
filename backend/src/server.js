import express from "express";
import auth from "./routes/auth.routes.js"
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", auth)

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
    connectDB();
});