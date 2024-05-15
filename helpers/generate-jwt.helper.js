import jwt from "jsonwebtoken";

export const generateJWT = (uid) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { uid },
      process.env.SECRET_JWT_KEY,
      { expiresIn: "4h" },
      (error, token) => {
        if (error) {
          console.log(error);
          reject("Unable to generate token");
        } else {
          resolve(token);
        }
      }
    );
  });
};
