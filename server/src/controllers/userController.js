import { User } from "../models/User.js";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    await User.findByIdAndUpdate(req.userId, { name, avatar });

    res.json({ message: "Profile updated" });
  } catch (err) {
    next(err);
  }
};
