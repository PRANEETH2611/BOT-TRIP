import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message:
        error.name === "TokenExpiredError"
          ? "Your session has expired"
          : "Invalid authentication token"
    });
  }
}

export function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export function protectMedia(req, res, next) {
  const token = req.query.token;
  if (!token) return protect(req, res, next);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (
      decoded.purpose !== "media" ||
      decoded.memoryId !== req.params.id
    ) {
      return res.status(401).json({ message: "Invalid media token" });
    }
    req.mediaToken = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Media link has expired" });
  }
}
