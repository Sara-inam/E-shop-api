// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true, trim: true, required: true },
  description: { type: String, default:"" },
  gender: {
    type: String,
    enum: ["Men", "Women", "Kids"], // only these values are allowed
    required: true,
  },
 
  
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);
export default Category;
