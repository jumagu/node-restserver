import { Schema, model } from "mongoose";

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },

  password: {
    type: String,
    // required: [true, "Password is required"],
    required: [
      function () {
        return !this.google;
      },
      "Password is required when Google is false",
    ],
  },

  image: {
    type: String,
  },

  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["ADMIN", "USER"],
    default: "USER",
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { _id, __v, password, ...user } = this.toObject();

  user.uid = _id;

  return user;
};

export default model("User", UserSchema);
