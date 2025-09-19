import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import cors from "cors";

const app = express();

// ✅ Connect to MongoDB
connectDb();

// ✅ Razorpay instance
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
export { instance };

// ✅ Middlewares
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // frontend allowed

// ✅ Routes
app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/uploads", express.static("uploads"));

// Importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";

// Using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);

// ✅ Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
