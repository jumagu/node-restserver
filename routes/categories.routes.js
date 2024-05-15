import { Router } from "express";
import { check } from "express-validator";

import { validateCategoryId } from "../helpers/db-validators.helper.js";

import {
  JWTValidator,
  roleValidator,
  fieldsValidator,
} from "../middlewares/index.js";

import {
  getCategory,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categories.controller.js";

const router = Router();

router.get("/", [], getCategories);

router.get(
  "/:id",
  [
    check("id", "Please provide a valid id").isMongoId(),
    check("id").custom(validateCategoryId),
    fieldsValidator,
  ],
  getCategory
);

router.post(
  "/",
  [
    JWTValidator,
    check("name", "Name is required").not().isEmpty(),
    fieldsValidator,
  ],
  createCategory
);

router.put(
  "/:id",
  [
    JWTValidator,
    check("id").custom(validateCategoryId),
    check("id", "Please provide a valid id").isMongoId(),
    check("name", "Name is required").not().isEmpty(),
    fieldsValidator,
  ],
  updateCategory
);

router.delete(
  "/:id",
  [
    JWTValidator,
    roleValidator("ADMIN"),
    check("id", "Please provide a valid id").isMongoId(),
    check("id").custom(validateCategoryId),
    fieldsValidator,
  ],
  deleteCategory
);

export default router;
