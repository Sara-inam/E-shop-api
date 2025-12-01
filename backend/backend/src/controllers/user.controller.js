
import User from "../models/user.model.js";

export const getAllUsersOnly = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");

    return res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
