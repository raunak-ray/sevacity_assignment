import authService from "../service/auth.service.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import logger from "../utils/logger.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await authService.register(req.body);

  logger.api(req, 201, "User registered");

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const result = await authService.login(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  logger.api(req, 200, "User logged in");

  res.status(200).json({
    success: true,
    accessToken: result.accessToken,

    user: result.user,
  });
});

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  const accessToken = await authService.refreshAccessToken(refreshToken);

  logger.api(req, 200, "Access token refreshed");

  res.status(200).json({
    success: true,
    accessToken,
  });
});

export const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  await authService.logout(refreshToken);

  res.clearCookie("refreshToken");

  logger.api(req, 200, "User logged out");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});
