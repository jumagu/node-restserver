import Role from "../models/role.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

// ? Verify if the role exist in DB
export const validateRole = async (role = "") => {
  const roleExist = await Role.findOne({ role });

  if (!roleExist) throw new Error(`${role} is not a valid role`);
};

// ? Verify if user already exist
export const validateEmail = async (email = "") => {
  const userExist = await User.findOne({ email });

  if (userExist) throw new Error("Email already taken");
};

// ? Verify if user id exist
export const validateUserId = async (id = "") => {
  const userExist = await User.findById(id);

  if (!userExist) throw new Error("User does not exist");
};

// ? Verify if category id exist
export const validateCategoryId = async (id = "") => {
  const categoryExist = await Category.findById(id);

  if (!categoryExist) throw new Error("Category does not exist");
};

// ? Verify if product id exist
export const validateProductId = async (id = "") => {
  const productExist = await Product.findById(id);

  if (!productExist) throw new Error("Product does not exist");
};
