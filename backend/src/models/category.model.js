// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true, trim: true, required: true },
  description: { type: String, default:"" },
  image: { type: String, default: "",
    },
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
