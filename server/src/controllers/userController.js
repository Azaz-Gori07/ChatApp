import { User } from "../models/User.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("id name email avatar");
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const q = req.query.q;
    if (!q) return res.json([]);

    const users = await User.find({
      name: { $regex: q, $options: "i" }
    }).select("id name email avatar");

    res.json(users);
  } catch (err) {
    next(err);
  }
};


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
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    await user.save();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

