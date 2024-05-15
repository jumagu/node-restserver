import { Schema, model } from "mongoose";

const ProductSchema = Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Name is required"],
  },

  price: {
    type: Number,
    default: 0,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },

  description: {
    type: String,
  },

  available: {
    type: Boolean,
    default: true,
  },

  image: {
    type: String,
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
});

ProductSchema.methods.toJSON = function () {
  const { __v, isActive, ...product } = this.toObject();

  return product;
};

export default model("Product", ProductSchema);
