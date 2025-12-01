import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProducts
} from "../controllers/product.controller.js";
import { verifyToken, isAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const Productrouter = express.Router();

Productrouter.post("/create", verifyToken, isAdmin, upload.single("image"), createProduct);
Productrouter.put("/update/:id", verifyToken, isAdmin, upload.single("image"), updateProduct);
Productrouter.get("/all", getAllProducts);
// Productrouter.get("/:id", getProductById);
Productrouter.delete("/delete/:id", verifyToken, isAdmin, deleteProduct);

//   search route
Productrouter.get("/search", verifyToken, searchProducts);

export default Productrouter;
