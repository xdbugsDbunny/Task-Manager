import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "https://task-manager-cf.vercel.app",
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

export { app };
