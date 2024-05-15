import { request, response } from "express";

import Product from "../models/product.model.js";

export const getProducts = async (req = request, res = response) => {
  const { skip, limit } = req.query;

  const [products, total] = await Promise.all([
    Product.find({ isActive: true })
      .skip(Number(skip))
      .limit(Number(limit))
      .populate("category", "name")
      .populate("user", "name"),
    Product.countDocuments({ isActive: true }),
  ]);

  res.json({
    total,
    products,
  });
};

export const getProduct = async (req = request, res = response) => {
  const id = req.params.id;

  const product = await Product.findById(id)
    .populate("category", "name")
    .populate("user", "name");

  res.json(product);
};

export const createProduct = async (req = request, res = response) => {
  // const { name, price, category, description, available } = req.body;
  const { isActive, user, ...rest } = req.body;

  let product = await Product.findOne({ name: rest.name });

  if (product)
    res.status(400).json({
      msg: `Product with name: ${product.name} already exists`,
    });

  product = new Product({
    ...rest,
    user: req.authenticatedUser._id,
  });

  await product.save();

  res.status(201).json(product);
};

export const updateProduct = async (req = request, res = response) => {
  const id = req.params.id;

  const { _id, isActive, user, ...rest } = req.body;

  const product = await Product.findByIdAndUpdate(
    id,
    {
      ...rest,
      user: req.authenticatedUser._id,
    },
    { new: true }
  ).populate("user", "name");

  res.json(product);
};

export const deleteProduct = async (req = request, res = response) => {
  const id = req.params.id;

  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).populate("user", "name");

  res.json(product);
};
