import { Router } from "express";
import { check } from "express-validator";

import { fieldsValidator } from "../middlewares/index.js";
import { fileValidator } from "../middlewares/file-validator.middleware.js";

import {
  getImage,
  uploadFile,
  uploadCloudinaryImage,
} from "../controllers/uploads.controller.js";

const router = Router();

router.post("/", uploadFile);

router.put(
  "/:collection/:id",
  [
    fileValidator,
    check("id", "Please provide a valid id").isMongoId(),
    check(
      "collection",
      "Please provide a valid collection. Allowed collections: users, products"
    ).isIn(["users", "products"]),
    fieldsValidator,
  ],
  uploadCloudinaryImage
  // uploadImage
);

router.get(
  "/:collection/:id",
  [
    check("id", "Please provide a valid id").isMongoId(),
    check(
      "collection",
      "Please provide a valid collection. Allowed collections: users, products"
    ).isIn(["users", "products"]),
    fieldsValidator,
  ],
  getImage
);

export default router;
