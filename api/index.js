import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import databaseConnection from "./database/databaseConnection.js";

const app = express();

app.use(
  cors({
    origin: "https://task-manager-black-one.vercel.app",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "other-header"],
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import taskRouter from "./routes/task.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/task", taskRouter);

app.get("/", (req, res) => {
  res.send("Working");
});

const PORT = process.env.PORT || 8000;

databaseConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Running at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB CONNECTION FAILED !!!!", err);
  });
