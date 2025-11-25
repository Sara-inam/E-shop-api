import express from 'express';
import { createCategory, getCategory, updateCategory, deletedCategory } from '../controllers/category.controller.js';
import { isAdmin,verifyToken } from '../middleware/auth.middleware.js';

const categoryRouter = express.Router();
categoryRouter.post("/create", isAdmin, verifyToken, createCategory);
categoryRouter.get("/all", isAdmin, verifyToken, getCategory);
categoryRouter.put("/update/:id", isAdmin, verifyToken, updateCategory);
categoryRouter.delete("/delete/:id", isAdmin, verifyToken, deletedCategory);

export default categoryRouter;
