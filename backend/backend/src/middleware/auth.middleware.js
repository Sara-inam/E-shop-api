import jwt from "jsonwebtoken";       // ⚠ Import missing
import User from "../models/user.model.js";
import config from "../../config.js";  // make sure JWT_SECRET is defined here

// Verify Token
export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });

    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, config.JWT_SECRET);  // ⚠ jwt verify works now
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(404).json({ message: "User not found" });

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized", error: error.message });
  }
};

// Check if Admin
export const isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
