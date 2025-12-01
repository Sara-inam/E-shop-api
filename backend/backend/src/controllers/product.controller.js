import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import mongoose from "mongoose";
import NodeCache from "node-cache";


// NodeCache with 1 hour TTL
const productCache = new NodeCache({ stdTTL: 3600 });

// Helper: flush product cache
const flushProductCache = () => productCache.flushAll();

// CREATE Product
export const createProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { name, category, brand, price, quantity, description } = req.body;

    if (!name || !category || !brand || !price || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Find category by name
    const categoryDoc = await Category.findOne({ name: category });
    if (!categoryDoc) {
      return res.status(400).json({ message: "Category not found" });
    }

    const images = req.file ? [`/uploads/${req.file.filename}`] : [];

    const existing = await Product.findOne({ name }).session(session);
    if (existing) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Product already exists" });
    }

    const product = new Product({
      name,
      category: categoryDoc._id,
      brand,
      price: Number(price),
      quantity: Number(quantity) || 0,
      images,
      description
    });

    await product.save({ session });
    await session.commitTransaction();
    session.endSession();

    flushProductCache();

    const productWithCategory = await Product.findById(product._id).populate("category", "name");

    res.status(201).json({ message: "Product created successfully", product: productWithCategory });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create Product Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// GET ALL Products
export const getAllProducts = async (req, res) => {
  try {
    const cacheKey = "allProducts";

    // Check cache
    const cachedData = productCache.get(cacheKey);
    if (cachedData) return res.status(200).json({ products: cachedData, source: "cache" });

    // Fetch all products from DB
    const products = await Product.find().sort({ createdAt: -1 }).lean(); // convert to plain objects

    // Populate category safely
    const productsWithCategory = await Promise.all(
      products.map(async (product) => {
        if (product.category) {
          const categoryDoc = await Category.findById(product.category).select("name");
          product.category = categoryDoc ? categoryDoc.name : null;
        } else {
          product.category = null;
        }
        return product;
      })
    );

    // Save to cache
    productCache.set(cacheKey, productsWithCategory);

    res.status(200).json({ products: productsWithCategory, source: "db" });
  } catch (error) {
    console.error("Get All Products Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



// GET Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id).populate("category", "name");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ product });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// UPDATE Product
export const updateProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (updatedData.category) {
      const categoryDoc = await Category.findOne({ name: updatedData.category });
      if (!categoryDoc) {
        return res.status(400).json({ message: "Category not found" });
      }
      updatedData.category = categoryDoc._id;
    }

    if (req.file) {
      updatedData.images = [`/uploads/${req.file.filename}`];
    }

    const updated = await Product.findByIdAndUpdate(id, updatedData, { new: true, session });
    if (!updated) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    await session.commitTransaction();
    session.endSession();

    flushProductCache();

    res.status(200).json({ message: "Product updated successfully", updated });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// DELETE Product
export const deleteProduct = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deleted = await Product.findByIdAndDelete(id, { session });
    if (!deleted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    await session.commitTransaction();
    session.endSession();

    flushProductCache();

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const searchProducts = async (req, res) => {
    try {
        const query = req.query.q?.trim();
        if (!query) {
            return res.status(400).json({ message: "Please provide a search query" });
        }

        // Case-insensitive regex, match anywhere in the name
        const regex = new RegExp(query, "i");  

        const products = await Product.find({ name: { $regex: regex } });

        if (products.length > 0) {
            res.json(products);
        } else {
            res.status(404).json({ message: "No result found" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};




