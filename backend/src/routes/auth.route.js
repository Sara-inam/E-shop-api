import express from 'express';
import { signup, login, forgetPassword, resetPassword, logout } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const authRouter = express.Router();


authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post("/forget-password", forgetPassword );
authRouter.post("/reset-password/:token", resetPassword );
authRouter.post("/logout", verifyToken, logout);
export default authRouter;
