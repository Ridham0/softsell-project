import Contact from "../models/Contact.js"
import asyncHandler from "../middlewares/asyncHandler.js"

// @desc    Create a new contact submission
// @route   POST /api/contacts
// @access  Public
export const createContact = asyncHandler(async (req, res) => {
  const { name, email, company, licenseType, message } = req.body

  const contact = await Contact.create({
    name,
    email,
    company,
    licenseType,
    message,
    status: "new",
  })

  res.status(201).json(contact)
})

// @desc    Get all contact submissions
// @route   GET /api/contacts
// @access  Private/Admin
export const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({}).sort({ createdAt: -1 })
  res.json(contacts)
})

// @desc    Get a contact submission by ID
// @route   GET /api/contacts/:id
// @access  Private/Admin
export const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    res.status(404)
    throw new Error("Contact submission not found")
  }

  res.json(contact)
})

// @desc    Update a contact submission
// @route   PUT /api/contacts/:id
// @access  Private/Admin
export const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    res.status(404)
    throw new Error("Contact submission not found")
  }

  // Update contact fields
  contact.status = req.body.status || contact.status
  contact.assignedTo = req.body.assignedTo || contact.assignedTo

  const updatedContact = await contact.save()
  res.json(updatedContact)
})

// @desc    Delete a contact submission
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id)

  if (!contact) {
    res.status(404)
    throw new Error("Contact submission not found")
  }

  await contact.deleteOne()
  res.json({ message: "Contact submission removed" })
})
