import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

import path from "path";
import { v4 as uuidv4 } from "uuid";

export const fileUpload = (
  file,
  directory = "",
  validExtensions = ["png", "jpg", "jpeg", "gif"]
) => {
  return new Promise((resolve, reject) => {
    const fileExtension = file.name.split(".").at(-1);

    if (!validExtensions.includes(fileExtension))
      return reject(
        `File extension '${fileExtension}' is not allowed. Only can upload file with extensions: ${validExtensions}`
      );

    const fileName = uuidv4() + "." + fileExtension;
    const uploadPath = path.join(__dirname, "../uploads/", directory, fileName);

    file.mv(uploadPath, (error) => {
      if (error) reject(error);

      resolve(fileName);
    });
  });
};
