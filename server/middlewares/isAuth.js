import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({
        message: "Please login first",
      });
    }

    // ✅ use correct env variable
    console.log("JWT_SECRET from env:", process.env.JWT_SECRET);
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);


    req.user = await User.findById(decodedData.id); // or decodedData._id depending on how you sign it

    if (!req.user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not an admin",
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
