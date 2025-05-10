import express from "express"
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js"
import { protect, admin } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.route("/").post(registerUser).get(protect, admin, getUsers)

router.post("/login", loginUser)

router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile)

router.route("/:id").delete(protect, admin, deleteUser).get(protect, admin, getUserById).put(protect, admin, updateUser)

export default router
