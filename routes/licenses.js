import express from "express"
import {
  createLicense,
  getLicenses,
  getLicenseById,
  updateLicense,
  deleteLicense,
  makeOffer,
  respondToOffer,
  updatePaymentStatus,
} from "../controllers/licenseController.js"
import { protect, admin } from "../middlewares/authMiddleware.js"

const router = express.Router()

router.route("/").post(protect, createLicense).get(protect, getLicenses)

router.route("/:id").get(protect, getLicenseById).put(protect, updateLicense).delete(protect, deleteLicense)

router.route("/:id/offer").post(protect, admin, makeOffer)

router.route("/:id/respond").post(protect, respondToOffer)

router.route("/:id/payment").put(protect, admin, updatePaymentStatus)

export default router
