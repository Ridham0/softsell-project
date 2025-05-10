import License from "../models/License.js"
import asyncHandler from "../middlewares/asyncHandler.js"

// @desc    Create a new license
// @route   POST /api/licenses
// @access  Private
export const createLicense = asyncHandler(async (req, res) => {
  const { softwareName, licenseType, licenseKey, expiryDate, purchaseDate, originalPrice } = req.body

  // Calculate estimated value (dummy logic for demonstration)
  const today = new Date()
  const expiry = expiryDate ? new Date(expiryDate) : null

  let estimatedValue = originalPrice

  if (expiry && expiry > today) {
    // Calculate remaining time as a percentage
    const totalDuration = expiry - new Date(purchaseDate)
    const remainingDuration = expiry - today
    const remainingPercentage = remainingDuration / totalDuration

    // Adjust value based on remaining time (minimum 40% of original price)
    estimatedValue = Math.max(originalPrice * remainingPercentage, originalPrice * 0.4)
  } else {
    // If expired or no expiry date, value is 40% of original
    estimatedValue = originalPrice * 0.4
  }

  // Round to nearest dollar
  estimatedValue = Math.round(estimatedValue)

  const license = await License.create({
    user: req.user._id, // This would come from auth middleware
    softwareName,
    licenseType,
    licenseKey,
    expiryDate,
    purchaseDate,
    originalPrice,
    estimatedValue,
    status: "pending",
  })

  res.status(201).json(license)
})

// @desc    Get all licenses for a user
// @route   GET /api/licenses
// @access  Private
export const getLicenses = asyncHandler(async (req, res) => {
  const licenses = await License.find({ user: req.user._id })
  res.json(licenses)
})

// @desc    Get a license by ID
// @route   GET /api/licenses/:id
// @access  Private
export const getLicenseById = asyncHandler(async (req, res) => {
  const license = await License.findById(req.params.id)

  if (!license) {
    res.status(404)
    throw new Error("License not found")
  }

  // Check if the license belongs to the user
  if (license.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to access this license")
  }

  res.json(license)
})

// @desc    Update a license
// @route   PUT /api/licenses/:id
// @access  Private
export const updateLicense = asyncHandler(async (req, res) => {
  const license = await License.findById(req.params.id)

  if (!license) {
    res.status(404)
    throw new Error("License not found")
  }

  // Check if the license belongs to the user
  if (license.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to update this license")
  }

  // Update license fields
  Object.keys(req.body).forEach((key) => {
    if (key !== "user" && key !== "_id") {
      // Prevent changing user or _id
      license[key] = req.body[key]
    }
  })

  const updatedLicense = await license.save()
  res.json(updatedLicense)
})

// @desc    Delete a license
// @route   DELETE /api/licenses/:id
// @access  Private
export const deleteLicense = asyncHandler(async (req, res) => {
  const license = await License.findById(req.params.id)

  if (!license) {
    res.status(404)
    throw new Error("License not found")
  }

  // Check if the license belongs to the user
  if (license.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to delete this license")
  }

  await license.deleteOne()
  res.json({ message: "License removed" })
})

// @desc    Make an offer for a license
// @route   POST /api/licenses/:id/offer
// @access  Private/Admin
export const makeOffer = asyncHandler(async (req, res) => {
  const { offerAmount } = req.body

  const license = await License.findById(req.params.id)

  if (!license) {
    res.status(404)
    throw new Error("License not found")
  }

  // Only admins can make offers
  if (req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to make offers")
  }

  license.offerAmount = offerAmount
  license.status = "approved"

  const updatedLicense = await license.save()
  res.json(updatedLicense)
})

// @desc    Accept or reject an offer
// @route   POST /api/licenses/:id/respond
// @access  Private
export const respondToOffer = asyncHandler(async (req, res) => {
  const { accepted, paymentMethod } = req.body

  const license = await License.findById(req.params.id)

  if (!license) {
    res.status(404)
    throw new Error("License not found")
  }

  // Check if the license belongs to the user
  if (license.user.toString() !== req.user._id.toString()) {
    res.status(403)
    throw new Error("Not authorized to respond to this offer")
  }

  // Check if there's an offer to respond to
  if (!license.offerAmount) {
    res.status(400)
    throw new Error("No offer has been made for this license")
  }

  license.offerAccepted = accepted

  if (accepted) {
    license.status = "sold"
    license.paymentMethod = paymentMethod
    license.paymentStatus = "pending"
  } else {
    license.status = "rejected"
  }

  const updatedLicense = await license.save()
  res.json(updatedLicense)
})

// @desc    Update payment status
// @route   PUT /api/licenses/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body

  const license = await License.findById(req.params.id)

  if (!license) {
    res.status(404)
    throw new Error("License not found")
  }

  // Only admins can update payment status
  if (req.user.role !== "admin") {
    res.status(403)
    throw new Error("Not authorized to update payment status")
  }

  license.paymentStatus = paymentStatus

  const updatedLicense = await license.save()
  res.json(updatedLicense)
})
