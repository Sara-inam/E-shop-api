import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";

const productRouter = express.Router();

productRouter.post("/create", verifyToken, isAdmin, createProduct);
productRouter.get("/all", getProducts);
productRouter.get("/:id", getProductById);
productRouter.put("/update/:id", verifyToken, isAdmin, updateProduct);
productRouter.delete("/delete/:id", verifyToken, isAdmin, deleteProduct);

export default productRouter;
