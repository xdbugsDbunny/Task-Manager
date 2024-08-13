import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.models.js";

const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  if (
    [title, description, dueDate, priority].some(
      (field) => field?.trim() === ("" || undefined)
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const validPriorities = ["low", "medium", "high"];
  if (!validPriorities.includes(priority)) {
    throw new ApiError(400, "Invalid priority level");
  }

  const task = await Task.create({
    userId: req.user._id,
    title,
    description,
    dueDate,
    priority,
    status: "PENDING",
  });

  const createdTask = await Task.findById(task._id).select("-__v");

  if (!createdTask) {
    throw new ApiError(500, "Error while creating task");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdTask, "Task created successfully"));
});

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id }).select("-__v");

  if (!tasks || tasks.length === 0) {
    new ApiResponse(200, "No Tasks Found For The User");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks Fetched Successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findOne({ _id: id, userId: req.user._id }).select(
    "-__v"
  );

  if (!task) {
    throw new ApiError(404, "Task Not Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task Fetched Successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, priority, status } = req.body;

  if (
    [title, description, dueDate, priority, status].some(
      (field) => field?.trim() === ("" || undefined)
    )
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const checkPriorities = ["low", "medium", "high"];
  const checkStatuses = ["PENDING", "COMPLETED"];

  if (!checkPriorities.includes(priority)) {
    throw new ApiError(400, "Invalid priority level");
  }

  if (!checkStatuses.includes(status)) {
    throw new ApiError(400, "Invalid Status");
  }

  const task = await Task.findByIdAndUpdate(
    { _id: id, userId: req.user._id },
    {
      title,
      description,
      dueDate,
      priority,
      status,
    },
    { new: true, runValidators: true, context: "query" }
  ).select("-__v");

  if (!task) {
    throw new ApiError(404, "Some Thing Went Wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, task, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findByIdAndDelete({
    _id: id,
    userId: req.user._id,
  }).select("-__v");

  if (!task) {
    throw new ApiError(404, "Something went Wrong");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Task Deleted Successfully"));
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const checkStatuses = ["PENDING", "COMPLETED"];

  if (!status || !checkStatuses.includes(status)) {
    throw new ApiError(400, "Invalid Status");
  }

  const task = await Task.findById(id);

  if (!task) {
    throw new ApiError(404, "No Task Found");
  }

  task.status = status;
  const updatedTask = await task.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTask, "Task's Status Changed Successfully")
    );
});

const filterTasks = asyncHandler(async (req, res) => {
  const { status, priority, dueDate } = req.query;
  const filter = { userId: req.user._id };

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  if (dueDate) {
    const startOfDay = new Date(
      new Date(dueDate).setHours(0, 0, 0, 0)
    ).toISOString();
    const endOfDay = new Date(
      new Date(dueDate).setHours(23, 59, 59, 999)
    ).toISOString();
    filter.dueDate = { $gte: startOfDay, $lte: endOfDay };
  }

  const tasks = await Task.find(filter).select("-__v");

  if (!tasks || tasks.length === 0) {
    throw new ApiError(404, "No Task Found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tasks, "Tasks Fetched Successfully"));
});

export {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskStatus,
  filterTasks,
};
