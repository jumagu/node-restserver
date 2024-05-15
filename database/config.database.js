import mongoose from "mongoose";

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CNN);

    console.log("Connection successfully established");
  } catch (error) {
    console.log(error);
    throw new Error("An error ocurred while database initialization");
  }
};
