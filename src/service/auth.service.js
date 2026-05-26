import generateUUID from "../utils/uuid.js";

import { hashPassword, comparePassword } from "../utils/password.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

import ApiError from "../utils/ApiError.js";
import userRepository from "../repository/user.repository.js";
import tokenRepository from "../repository/token.repository.js";

class AuthService {
  async register(data) {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = {
      id: generateUUID(),
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
    };

    await userRepository.create(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }

  async login(data) {
    const user = await userRepository.findByEmail(data.email);

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    const isPasswordCorrect = await comparePassword(
      data.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid credentials");
    }

    const payload = {
      id: user.id,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    await tokenRepository.saveToken({
      id: generateUUID(),
      user_id: user.id,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async logout(refreshToken) {
    if (!refreshToken) {
      return;
    }

    await tokenRepository.deleteToken(refreshToken);
  }

  async refreshAccessToken(refreshToken) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    const storedToken = await tokenRepository.findToken(refreshToken);

    if (!storedToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const decoded = verifyRefreshToken(refreshToken);

    const accessToken = generateAccessToken({
      id: decoded.id,
      role: decoded.role,
    });

    return accessToken;
  }
}

export default new AuthService();
