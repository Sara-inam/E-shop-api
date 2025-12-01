import Order from "../models/order.model.js";

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { userId, items, totalPrice, address, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const order = new Order({
      user: userId,
      items,
      totalPrice,
      address,
      paymentMethod,
    });

    const savedOrder = await order.save();
    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all orders of a user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId }).populate("items.product");
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all orders (for admin, optional)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product").populate("user", "name email");
    res.status(200).json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update order status (for admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
