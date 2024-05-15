import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const JWTValidator = async (req, res, next) => {
  const token = req.header("x-token");

  if (!token)
    return res.status(401).json({
      msg: "Missing token header",
    });

  try {
    // ? Id of the current user (authenticated)
    const { uid } = jwt.verify(token, process.env.SECRET_JWT_KEY);

    const authenticatedUser = await User.findById(uid);

    if (!authenticatedUser)
      return res.status(401).json({
        msg: "Unathorized",
      });

    if (!authenticatedUser.isActive)
      return res.status(401).json({
        msg: "Unathorized",
      });

    req.authenticatedUser = authenticatedUser;

    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: "Invalid token",
    });
  }
};
