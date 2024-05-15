import { Router } from "express";
import { check } from "express-validator";

import {
  JWTValidator,
  roleValidator,
  fieldsValidator,
} from "../middlewares/index.js";
import {
  validateRole,
  validateEmail,
  validateUserId,
} from "../helpers/db-validators.helper.js";
import {
  getUsers,
  editUser,
  createUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Ivalid email pattern").isEmail(),
    check("email").custom(validateEmail),
    check("password", "Password must be between 8 and 16 characters").isLength({
      min: 8,
      max: 16,
    }),
    // check("role", "Invalid role").isIn(["ADMIN", "USER"]),
    check("role").custom(validateRole),
    fieldsValidator,
  ],
  createUser
);

router.put(
  "/:id",
  [
    check("name", "Name is required").not().isEmpty(),
    check("id", "Please provide a valid id").isMongoId(),
    check("id").custom(validateUserId),
    check("password", "Password must be between 8 and 16 characters").isLength({
      min: 8,
      max: 16,
    }),
    check("role").custom(validateRole),
    fieldsValidator,
  ],
  editUser
);

router.delete(
  "/:id",
  [
    JWTValidator,
    roleValidator("ADMIN"),
    check("id", "Please provide a valid id").isMongoId(),
    check("id").custom(validateUserId),
    fieldsValidator,
  ],
  deleteUser
);

export default router;
