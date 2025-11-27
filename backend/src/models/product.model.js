import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    // slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number },
    // inStock: { type: Boolean, default: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    // size: { type: String },
    // color: {type: String},
    // rating: { type: Number, default: 0 },
  },
  { timestamps: true });
  export default mongoose.model("Product", productSchema);