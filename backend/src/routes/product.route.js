import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const productRouter = express.Router();

// single file upload field name: 'image'
productRouter.post("/create", verifyToken, isAdmin, upload.single("image"), createProduct);
productRouter.put("/update/:id", verifyToken, isAdmin, upload.single("image"), updateProduct);

productRouter.get("/all", getProducts);
productRouter.get("/:id", getProductById);
productRouter.delete("/delete/:id", verifyToken, isAdmin, deleteProduct);

export default productRouter;
