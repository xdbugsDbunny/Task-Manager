import {
  createTask,
  deleteTask,
  filterTasks,
  getTaskById,
  getTasks,
  updateTask,
  updateTaskStatus,
} from "../controllers/task.controller.js";
import errorHandler from "../middlewares/errorHandler.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { Router } from "express";

const router = Router();
//error in filter 
//solution static route first, dynamic route later
//express gets confuse b/w /filter and /:id. It can take both as IDs

router.route("/filter").get(verifyJWT, filterTasks, errorHandler);

router.route("/").post(verifyJWT, createTask, errorHandler);
router.route("/").get(verifyJWT, getTasks, errorHandler);

router.route("/:id").get(verifyJWT, getTaskById, errorHandler);
router.route("/:id").put(verifyJWT, updateTask, errorHandler);
router.route("/:id").delete(verifyJWT, deleteTask, errorHandler);

router.route("/:id/status").patch(verifyJWT, updateTaskStatus, errorHandler);

export default router;
