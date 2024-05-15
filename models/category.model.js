import { Schema, model } from "mongoose";

const CategorySchema = Schema({
  name: {
    type: String,
    unique: true,
    required: [true, "Name is required"],
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

// todo: (opcional) cambiar '_id' de usuario a 'uid'
CategorySchema.methods.toJSON = function () {
  const { __v, isActive, ...category } = this.toObject();

  return category;
};

export default model("Category", CategorySchema);
