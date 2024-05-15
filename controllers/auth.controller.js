import { request, response } from "express";

import bcryptjs from "bcryptjs";

import User from "../models/user.model.js";
import { generateJWT } from "../helpers/generate-jwt.helper.js";
import { googleVerify } from "../helpers/google-verify.helper.js";

export const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({
        msg: "Invalid credentials",
      });

    if (!user.isActive)
      return res.status(400).json({
        msg: "Invalid credentials",
      });

    const passwordMatch = bcryptjs.compareSync(password, user.password);

    if (!passwordMatch)
      return res.status(400).json({
        msg: "Invalid credentials",
      });

    const token = await generateJWT(user.id);

    res.json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Something went wrong",
    });
  }
};

export const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, email, image } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        image,
        google: true,
        password: "",
      });

      await user.save();
    }

    if (!user.isActive)
      return res.status(401).json({
        msg: "Unauthorized",
      });

    const token = await generateJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: "Authentication with Google could not be completed",
    });
  }
};
