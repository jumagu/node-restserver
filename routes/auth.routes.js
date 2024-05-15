import { Router } from "express";
import { check } from "express-validator";

import { login, googleSignIn } from "../controllers/auth.controller.js";
import { fieldsValidator } from "../middlewares/fields-validator.middleware.js";

const router = Router();

router.post(
  "/login",
  [
    check("email", "Email is required").not().isEmpty(),
    check("email", "Ivalid email pattern").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    fieldsValidator,
  ],
  login
);

router.post(
  "/google",
  [check("id_token", "id_token is required").not().isEmpty(), fieldsValidator],
  googleSignIn
);

export default router;
