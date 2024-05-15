import { request, response } from "express";

import bcryptjs from "bcryptjs";

import User from "../models/user.model.js";

export const getUsers = async (req = request, res = response) => {
  const { skip, limit } = req.query;

  const [users, total] = await Promise.all([
    User.find({ isActive: true }).skip(Number(skip)).limit(Number(limit)),
    User.countDocuments({ isActive: true }),
  ]);

  res.json({
    total,
    users,
  });
};

export const createUser = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;

  const user = new User({ name, email, password, role });

  // ? Password encryption
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync(password, salt);

  // ? Save in DB
  await user.save();

  res.json(user);
};

export const editUser = async (req = request, res = response) => {
  const id = req.params.id;
  const { _id, password, google, email, ...rest } = req.body;

  if (password) {
    const salt = bcryptjs.genSaltSync();
    rest.password = bcryptjs.hashSync(password, salt);
  }

  const user = await User.findByIdAndUpdate(id, rest, { new: true });

  res.json(user);
};

export const deleteUser = async (req = request, res = response) => {
  const id = req.params.id;

  // ? Delete from DB
  // const user = await User.findByIdAndDelete(id);

  // ? Change the status to inactive (isActive: false)
  const user = await User.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  );

  res.json(user);
};
