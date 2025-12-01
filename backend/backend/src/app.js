import express from "express";
import authRouter from './routes/auth.route.js'; 
import categoryRouter from "./routes/category.route.js";
import Productrouter from './routes/product.route.js';
import Userrouter from './routes/user.route.js';
import Orderrouter from "./routes/order.route.js";

const app = express();

app.use(express.json());


app.use("/auth", authRouter);  
app.use("/category", categoryRouter);   
app.use("/product", Productrouter);
app.use("/user", Userrouter);
app.use("/order", Orderrouter);
app.use("/uploads", express.static("uploads"));
 
      


app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

export default app;
