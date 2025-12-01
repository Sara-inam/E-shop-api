import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const Orderrouter = express.Router();

// Create a new order
Orderrouter.post("/create",verifyToken, createOrder);

// Get all orders of a specific user
Orderrouter.get("/user/:userId",verifyToken, getUserOrders);

// Get all orders (admin)
Orderrouter.get("/",verifyToken, getAllOrders);

// Update order status (admin)
Orderrouter.put("/status/:id",verifyToken, updateOrderStatus);

export default Orderrouter;
