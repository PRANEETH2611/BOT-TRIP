import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Memory from "../models/Memory.js";
import User from "../models/User.js";

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d"
  });
}

function authResponse(user) {
  return { token: createToken(user._id), user: user.toJSON() };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, tripCode } = req.body;

    if (!name || !email || !password || !tripCode) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (tripCode !== process.env.TRIP_SECRET_CODE) {
      return res.status(403).json({ message: "That trip code is not valid" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    if (await User.exists({ email: normalizedEmail })) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const isAdmin =
      process.env.ADMIN_EMAIL?.toLowerCase().trim() === normalizedEmail;
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: passwordHash,
      role: isAdmin ? "admin" : "user"
    });

    return res.status(201).json(authResponse(user));
  } catch (error) {
    next(error);
  }
}

export function verifyTripCode(req, res) {
  if (!req.body.tripCode) {
    return res.status(400).json({ message: "Trip code is required" });
  }
  if (req.body.tripCode !== process.env.TRIP_SECRET_CODE) {
    return res.status(403).json({ message: "That trip code is not valid" });
  }
  res.json({ valid: true });
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json(authResponse(user));
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req, res, next) {
  try {
    const [totalUploads, likedMemories] = await Promise.all([
      Memory.countDocuments({ uploadedBy: req.user._id }),
      Memory.countDocuments({ likes: req.user._id })
    ]);

    res.json({
      user: req.user,
      stats: { totalUploads, likedMemories }
    });
  } catch (error) {
    next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, profileImage } = req.body;
    if (typeof name === "string" && name.trim()) req.user.name = name.trim();
    if (typeof profileImage === "string") req.user.profileImage = profileImage.trim();
    await req.user.save();
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
}
