import express from "express";
import auth from "./routes/auth.routes.js"
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 5001;

dotenv.config();

app.use(express.json());
app.use("/api/auth", auth)

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
    connectDB();
});