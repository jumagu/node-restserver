import { Router } from "express";
import { check } from "express-validator";

import {
  validateProductId,
  validateCategoryId,
} from "../helpers/db-validators.helper.js";

import {
  JWTValidator,
  roleValidator,
  fieldsValidator,
} from "../middlewares/index.js";

import {
  getProduct,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", [], getProducts);

router.get(
  "/:id",
  [
    check("id", "Please provide a valid id").isMongoId(),
    check("id").custom(validateProductId),
    fieldsValidator,
  ],
  getProduct
);

router.post(
  "/",
  [
    JWTValidator,
    check("name", "Name is required").not().isEmpty(),
    check("category", "Category is required").not().isEmpty(),
    check("category", "Please provide a valid category id").isMongoId(),
    check("category").custom(validateCategoryId),
    fieldsValidator,
  ],
  createProduct
);

router.put(
  "/:id",
  [
    JWTValidator,
    check("id", "Please provide a valid id").isMongoId(),
    check("id").custom(validateProductId),
    // check("name", "Name is required").not().isEmpty(),
    fieldsValidator,
  ],
  updateProduct
);

router.delete(
  "/:id",
  [
    JWTValidator,
    roleValidator("ADMIN"),
    check("id", "Please provide a valid id").isMongoId(),
    check("id").custom(validateProductId),
    fieldsValidator,
  ],
  deleteProduct
);

export default router;
