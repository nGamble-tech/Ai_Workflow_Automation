import bcrypt from "bcrypt";
import { createUser, getUserByEmail, getUserById } from "../models/authModel.js";
import { signToken } from "../utils/jwt.js";

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await getUserByEmail(normalizedEmail);

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser({
      email: normalizedEmail,
      passwordHash,
    });

    const token = signToken(user);

    res.status(201).json({
      message: "User registered successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Failed to register user",
      error: error.message,
    });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = signToken(user);

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Failed to login",
      error: error.message,
    });
  }
}

export async function getMe(req, res) {
  try {
    const user = await getUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({
      message: "Failed to fetch current user",
      error: error.message,
    });
  }
}