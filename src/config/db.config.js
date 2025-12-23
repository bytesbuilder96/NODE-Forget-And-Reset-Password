import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const DB_URL = process.env.DB_URL;
    if (!DB_URL) {
      console.log("Database url not define in envarment variable");
    }
    const connectionInstance = await mongoose.connect(DB_URL);
    console.log(
      `Database Conneceted on host || ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Database not Connected");
  }
};
