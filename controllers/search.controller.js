import { request, response } from "express";

import { isValidObjectId } from "mongoose";

import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

const validCollections = ["users", "categories", "products", "roles"];

export const search = async (req = request, res = response) => {
  const { collection, term } = req.params;

  if (!validCollections.includes(collection))
    return res.status(400).json({
      msg: `Allowed collections: ${validCollections}`,
    });

  switch (collection) {
    case "users":
      await searchUsers(term, res);
      break;

    case "categories":
      searchCategories(term, res);
      break;

    case "products":
      searchProducts(term, res);
      break;

    default:
      return res.status(500).json({
        msg: "Internal server error",
      });
  }
};

const searchUsers = async (term = "", res = response) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const user = await User.findById(term);

    return res.json({
      results: user ? [user] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const users = await User.find({
    $or: [{ name: regex }, { email: regex }],
    $and: [{ isActive: true }],
  });

  res.json({
    results: users,
  });
};

const searchCategories = async (term = "", res = response) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const category = await Category.findById(term);

    return res.json({
      results: category ? [category] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const categories = await Category.find({ name: regex, isActive: true });

  res.json({
    results: categories,
  });
};

// TODO: buscar producto por categoría
const searchProducts = async (term = "", res = response) => {
  const isMongoId = isValidObjectId(term);

  if (isMongoId) {
    const product = await Product.findById(term).populate("category", "name");

    return res.json({
      results: product ? [product] : [],
    });
  }

  const regex = new RegExp(term, "i");

  const products = await Product.find({ name: regex, isActive: true }).populate(
    "category",
    "name"
  );

  res.json({
    results: products,
  });
};
