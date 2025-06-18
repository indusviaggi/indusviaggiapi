import mongoose from "mongoose";
export const connectDB = async () => {
  const connectionUrl = process.env.MONGO_URI || '';
  await mongoose
    .connect(connectionUrl, {
      dbName: process.env.DATABASE_NAME || ''
    })
    .then(() => {
      console.log("Successfully connected to the database");
    })
    .catch((err) => {
      console.log("Error connecting to the database");
      console.log(err);
      process.exit();
    });
};
