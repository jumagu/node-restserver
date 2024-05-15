import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import { config } from "dotenv";

import fs from "fs";
import path from "path";

import { request, response } from "express";

import { v2 as cloudinary } from "cloudinary";

import User from "../models/user.model.js";
import Product from "../models/product.model.js";

import { fileUpload } from "../helpers/file-upload.helper.js";

/**
 * ! The configuration of the environment variables is
 * ! called again so that they can be read from this file.
 */
config();

// * Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadFile = async (req = request, res = response) => {
  try {
    const fileName = await fileUpload(req.files.file, "images");

    res.json({
      fileName,
    });
  } catch (error) {
    res.status(400).json({
      msg: error,
    });
  }
};

export const uploadImage = async (req = request, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `There is no user with the id: ${id}`,
        });
      break;

    case "products":
      model = await Product.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `There is no product with the id: ${id}`,
        });
      break;

    default:
      return res.status(500).json({
        msg: "Internal server error",
      });
  }

  // ? Delete previous images
  if (model.image) {
    const imagePath = path.join(
      __dirname,
      "../uploads/images",
      collection,
      model.image
    );

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  try {
    const imageName = await fileUpload(req.files.file, `images/${collection}`);

    model.image = imageName;

    await model.save();

    res.json(model);
  } catch (error) {
    res.status(400).json({
      msg: error,
    });
  }
};

export const getImage = async (req = request, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `There is no user with the id: ${id}`,
        });
      break;

    case "products":
      model = await Product.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `There is no product with the id: ${id}`,
        });
      break;

    default:
      return res.status(500).json({
        msg: "Internal server error",
      });
  }

  if (model.image) {
    const imagePath = path.join(
      __dirname,
      "../uploads/images",
      collection,
      model.image
    );

    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }

  const placeholderImage = path.join(
    __dirname,
    "../assets/images/no-image.jpg"
  );

  res.sendFile(placeholderImage);
};

export const uploadCloudinaryImage = async (req = request, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch (collection) {
    case "users":
      model = await User.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `There is no user with the id: ${id}`,
        });
      break;

    case "products":
      model = await Product.findById(id);
      if (!model)
        return res.status(400).json({
          msg: `There is no product with the id: ${id}`,
        });
      break;

    default:
      return res.status(500).json({
        msg: "Internal server error",
      });
  }

  // ? Delete previous images
  if (model.image) {
    const imagePublicId = model.image.split("/").pop()?.split(".")[0] ?? "";

    cloudinary.uploader.destroy(`node-rest-server/${imagePublicId}`);

    /* try {
      await cloudinary.uploader.destroy(`node-rest-server/${imagePublicId}`);
    } catch (error) {
      console.log(error);

      return res.status(400).json({
        msg: error,
      });
    } */
  }

  try {
    const { secure_url } = await cloudinary.uploader.upload(
      req.files.file.tempFilePath,
      { folder: "node-rest-server" }
    );

    model.image = secure_url;

    await model.save();

    res.json(model);
  } catch (error) {
    console.log(error);

    return res.status(400).json({
      msg: error,
    });
  }
};
