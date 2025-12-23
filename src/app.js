import express from "express";
import cors from "cors";
import morgan from "morgan";
import { route } from "./routes/index.js";

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static("public"));

app.use("/api", route);
export { app };
