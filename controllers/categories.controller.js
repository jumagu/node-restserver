import { request, response } from "express";

import Category from "../models/category.model.js";

export const getCategories = async (req = request, res = response) => {
  const { skip, limit } = req.query;

  const [categories, total] = await Promise.all([
    Category.find({ isActive: true })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate("user", "name"),
    Category.countDocuments({ isActive: true }),
  ]);

  res.json({
    total,
    categories,
  });
};

export const getCategory = async (req = request, res = response) => {
  const id = req.params.id;

  const category = await Category.findById(id).populate("user", "name");

  res.json(category);
};

export const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  let category = await Category.findOne({ name });

  // todo: si la categoría está inactiva (isActive: false), cambiar el estado a true.

  if (category)
    return res.status(400).json({
      msg: `Category ${category.name} already exists`,
    });

  category = new Category({ name, user: req.authenticatedUser._id });

  await category.save();

  res.status(201).json(category);
};

export const updateCategory = async (req = request, res = response) => {
  const id = req.params.id;

  const category = await Category.findByIdAndUpdate(
    id,
    {
      name: req.body.name.toUpperCase(),
      user: req.authenticatedUser._id,
    },
    { new: true }
  ).populate("user", "name");

  res.json(category);
};

export const deleteCategory = async (req = request, res = response) => {
  const id = req.params.id;

  const category = await Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).populate("user", "name");

  res.json(category);
};
