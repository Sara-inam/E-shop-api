import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
     status: { type: String, default: "Pending" },  
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
