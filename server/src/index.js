import dotenv from "dotenv";
import { app } from "./app.js";
import databaseConnection from "./database/databaseConnection.js";

dotenv.config({
  path: "./.env",
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
