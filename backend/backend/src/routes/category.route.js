import express from 'express';
import { createCategory, getCategory, updateCategory, deletedCategory } from '../controllers/category.controller.js';
import { isAdmin,verifyToken } from '../middleware/auth.middleware.js';

const categoryRouter = express.Router();
categoryRouter.post("/create",  verifyToken,isAdmin, createCategory);
categoryRouter.get("/all",  verifyToken,isAdmin, getCategory);
categoryRouter.put("/update/:id",  verifyToken,isAdmin, updateCategory);
categoryRouter.delete("/delete/:id",  verifyToken,isAdmin, deletedCategory);

export default categoryRouter;
