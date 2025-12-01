import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number },
    images: [{ type: String }],
    description: { type: String, required: true },
  },
  { timestamps: true });
  export default mongoose.model("Product", productSchema);