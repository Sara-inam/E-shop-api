
import express from "express";

import { isAdmin , verifyToken } from "../middleware/auth.middleware.js";
import { getAllUsersOnly } from "../controllers/user.controller.js";

const Userrouter = express.Router();

Userrouter.get("/all", verifyToken, isAdmin, getAllUsersOnly);

export default Userrouter;
