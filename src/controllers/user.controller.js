import User from "../models/User.js";
import JWT from "../services/jwt_service.js";
import userValidation from "../validations/user.validation.js";
import bcrypt from "bcrypt";
import AppError from "../utils/AppError.js";
import to from "../utils/to_promise.js";
import { sendActivationMail } from '../services/mailToActivate.js';

export async function addUser(req, res, next) {
  try {
    const { error, value } = userValidation(req.body);

    if (error) {
      return next(
        new AppError(400, error.details[0].message || "Validation failed")
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: value.email.toLowerCase() }, { username: value.username }],
    });

    if (existingUser) {
      const field =
        existingUser.email === value.email.toLowerCase() ? "Email" : "Username";
      return next(new AppError(409, `${field} already in use`));
    }

    const hashed_password = await bcrypt.hash(value.password, 12); // async is better

    const newUser = await User.create({
      ...value,
      email: value.email.toLowerCase(),
      hashed_password,
      is_active: false,
      refresh_token: null,
    });

    // Generate activation token
    const linkToken = JWT.generateLinkToken({ id: newUser._id });
    const activationLink = `${process.env.API_URL}/api/user/activate/${linkToken}`;
    
    // Send activation email (don't wait if not critical)
    sendActivationMail(newUser.email, activationLink).catch((err) => {
      console.error("Failed to send activation email:", err);
      // Optionally log to monitoring service
    });

    return res.status(201).json({
      status: "success",
      message:
        "User created successfully. Please check your email to activate your account.",
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          description: newUser.description || null,
          is_active: newUser.is_active,
          createdAt: newUser.createdAt,
        },
      },
    });
  } catch (err) {
    // Let the centralized handler deal with it
    next(err);
  }
}

export async function activateUser(req, res, next) {
  try {
    const linkToken = req.params.linktoken;
    const [error, decoded] = await to(JWT.verifyLinkToken(linkToken));
    

    if (error) {
      return next(new AppError(400, "Invalid or expired activation link. Please register again."));
    }

    const userId = decoded.id;
    const user = await User.findById(userId);

    if (!user) {
      return next(new AppError(404, "User not found. Please register again."));
    }

    if (user.is_active) {
      return next(new AppError(400, "User is already activated"));
    }

    user.is_active = true;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Account activated successfully",
    });
  } catch (error) {
    next(error);
  }
}


