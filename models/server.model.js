import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";

import authRouter from "../routes/auth.routes.js";
import usersRouter from "../routes/users.routes.js";
import searchRouter from "../routes/search.routes.js";
import uploadsRouter from "../routes/uploads.routes.js";
import productsRouter from "../routes/products.routes.js";
import categoriesRouter from "../routes/categories.routes.js";

import { dbConnection } from "../database/config.database.js";

export default class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    // ? Connect DB
    this.connectDB();

    // ? Middlewares
    this.middlewares();

    // ? Routes
    this.routes();
  }

  async connectDB() {
    await dbConnection();
  }

  middlewares() {
    // ? CORS
    this.app.use(cors());

    // ? JSON parse
    this.app.use(express.json());

    // ? Public directory
    this.app.use(express.static("public"));

    // ? File Upload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use("/api/auth", authRouter);
    this.app.use("/api/users", usersRouter);
    this.app.use("/api/search", searchRouter);
    this.app.use("/api/uploads", uploadsRouter);
    this.app.use("/api/products", productsRouter);
    this.app.use("/api/categories", categoriesRouter);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Server running on port", this.port);
    });
  }
}
