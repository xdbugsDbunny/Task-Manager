import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ "Internal Server Error hai": err.message });
  }
};
// const errorHandler = (err, req, res, next) => {
//   if (err instanceof ApiError) {
//     // Log the error to the terminal
//     console.error("Error :", err);

//     // Send the error response to the frontend
//     return res.status(err.statusCode).json({
//       success: err.success,
//       message: err.message,
//       errors: err.errors,
//     });
//   }

//   // Handle other types of errors
//   console.error(err);
//   return res.status(500).json({
//     success: false,
//     message: "Internal Server Error",
//   });
// };

export default errorHandler;
