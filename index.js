import "dotenv/config";
import { app } from "./src/app.js";
import { connectDB } from "./src/config/db.config.js";

const serverStart = async (req, res) => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is Runing or port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Sever not Starterd");
  }
};
serverStart();
