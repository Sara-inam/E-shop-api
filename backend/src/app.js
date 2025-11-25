import express from "express";
import authRouter from './routes/auth.route.js'; 
import categoryRouter from "./routes/category.route.js";
import productRouter from './routes/product.route.js';

const app = express();

app.use(express.json());


app.use("/auth", authRouter);  
app.use("/category", categoryRouter);   
app.use("/product", productRouter);
 
      


app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

export default app;
