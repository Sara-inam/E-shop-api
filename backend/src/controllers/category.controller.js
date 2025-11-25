import mongoose from "mongoose";
import Category from "../models/category.model.js";

// In-memory cache
const memoryCache = {
  categories: null,
  timestamp: null,
  ttl: 3600 * 1000, // 1 hour
};

// Helper: flush cache
const flushCategoryCache = () => {
  memoryCache.categories = null;
  memoryCache.timestamp = null;
};

// CREATE Category (POST) with transaction
export const createCategory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, description, image } = req.body;

    const existing = await Category.findOne({ name }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Category already exist" });
    }

    const category = await Category.create([{ name, description, image }], { session });

    await session.commitTransaction();
    session.endSession();

    flushCategoryCache();

    res.status(200).json({ message: "Category created successfully", category: category[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET Categories (no transaction/session, read-only)
export const getCategory = async (req, res) => {
  try {
    const now = Date.now();
    if (memoryCache.categories && memoryCache.timestamp + memoryCache.ttl > now) {
      return res.status(200).json({ categories: memoryCache.categories, source: "cache" });
    }

    const categories = await Category.find().sort({ createdAt: -1 });

    memoryCache.categories = categories;
    memoryCache.timestamp = now;

    res.status(200).json({ categories, source: "db" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// UPDATE Category (PUT) with transaction
export const updateCategory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const updated = await Category.findByIdAndUpdate(id, req.body, { new: true, session });
    if (!updated) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Category not found" });
    }

    await session.commitTransaction();
    session.endSession();

    flushCategoryCache();

    res.status(200).json({ message: "Category updated successfully", updated });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// DELETE Category (DELETE) with transaction
export const deletedCategory = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const deleted = await Category.findByIdAndDelete(id, { session });
    if (!deleted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Category not found" });
    }

    await session.commitTransaction();
    session.endSession();

    flushCategoryCache();

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
