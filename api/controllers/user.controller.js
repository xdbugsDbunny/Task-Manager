import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something Went Wrong While generating Tokens");
  }
};

const options = {
  httpOnly: true, // Prevents JavaScript access to cookies
  // secure: process.env.NODE_ENV === 'production',  // Ensures cookies are only sent over HTTPS in production
  secure: true,
  sameSite: "None",
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (
    [name, email, password].some((field) => field?.trim() === ("" || undefined))
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  if (!req.file || !req.file.path) {
    throw new ApiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(req.file.path);
  if (!avatar || !avatar.url) {
    throw new ApiError(400, "Error uploading avatar file");
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar: avatar.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -__v"
  );

  if (!createdUser) {
    throw new ApiError(500, "Error while registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User doesnt exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Wrong Password");
  }

  const { refreshToken, accessToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -__v"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res.status(401).json(new ApiResponse(401, {}, "Unauthorized"));
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

const getUserById = asyncHandler(async (req, res) => {
  try {
    return res.status(200).json(new ApiResponse(200, req.user, "Working"));
  } catch (error) {
    throw new ApiError(400, "Something went wrong");
  }
});

const checkAuth = asyncHandler(async (req, res) => {
  if (req.user) {
    return res.status(200).json(new ApiResponse(200, {}, "Authenticated"));
  } else {
    throw new ApiError(401, "Not authenticated");
  }
});

export { registerUser, loginUser, logoutUser, getUserById, checkAuth };
