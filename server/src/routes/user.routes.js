import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  checkAuth,
  getUserById,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import errorHandler from "../middlewares/errorHandler.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.single("avatar"), registerUser, errorHandler);

router.route("/login").post(loginUser, errorHandler);

router.route("/logout").post(verifyJWT, logoutUser, errorHandler);

router.route("/get-user").post(verifyJWT, getUserById, errorHandler);

router.post("/check-auth", verifyJWT, checkAuth, errorHandler);

export default router;
