import { asyncHandler } from "../utilities/asyncHandler.utility.js";
import { errorHandler } from "../utilities/errorHandler.utility.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const isAuthenticated = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.replace("Bearer ", "");

  if (!token) {
    return next(new errorHandler("No token provided", 401));
  }

  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user still exists
    const user = await User.findById(tokenData._id);
    if (!user) {
      return next(new errorHandler("User not found", 401));
    }

    req.user = tokenData;
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return next(new errorHandler("Invalid token", 401));
  }
});
