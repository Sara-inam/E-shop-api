import Product from "../models/product.model.js";
import mongoose from "mongoose";
import NodeCache from "node-cache";

// NodeCache with 1 hour TTL
const productCache = new NodeCache({ stdTTL: 3600 });

// Helper: flush product cache
const flushProductCache = () => {
  productCache.flushAll();
};

// CREATE Product with transaction
export const createProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { title, category, brand, price, salePrice, inStock, images, size, color, description } = req.body;

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const existing = await Product.findOne({ slug }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Product already exists" });
    }

    const product = await Product.create([{ title, slug, category, brand, price, salePrice, inStock, images, size, color, description }], { session });

    await session.commitTransaction();
    session.endSession();

    // Clear cache
    flushProductCache();

    res.status(201).json({ message: "Product created successfully", product: product[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET All Products (with NodeCache)
export const getProducts = async (req, res) => {
  try {
    const cacheKey = "allProducts";
    const cachedData = productCache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({ products: cachedData, source: "cache" });
    }

    const products = await Product.find().populate("category").sort({ createdAt: -1 });

    productCache.set(cacheKey, products);

    res.status(200).json({ products, source: "db" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET Product by ID (no cache, single fetch)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).populate("category");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// UPDATE Product with transaction
export const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;

    const updated = await Product.findByIdAndUpdate(id, req.body, { new: true, session });
    if (!updated) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    await session.commitTransaction();
    session.endSession();

    // Clear cache
    flushProductCache();

    res.status(200).json({ message: "Product updated successfully", updated });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// DELETE Product with transaction
export const deleteProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;

    const deleted = await Product.findByIdAndDelete(id, { session });
    if (!deleted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    await session.commitTransaction();
    session.endSession();

    // Clear cache
    flushProductCache();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
