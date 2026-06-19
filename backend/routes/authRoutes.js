import { Router } from "express";
import {
  getProfile,
  login,
  register,
  updateProfile,
  verifyTripCode
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-code", verifyTripCode);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
