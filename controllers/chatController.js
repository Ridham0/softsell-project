import ChatMessage from "../models/ChatMessage.js"
import asyncHandler from "../middlewares/asyncHandler.js"

// @desc    Get chat messages by session ID
// @route   GET /api/chat/:sessionId
// @access  Public
export const getChatMessages = asyncHandler(async (req, res) => {
  const { sessionId } = req.params

  const messages = await ChatMessage.find({ sessionId }).sort({ createdAt: 1 })

  res.json(messages)
})

// @desc    Create a new chat message
// @route   POST /api/chat
// @access  Public
export const createChatMessage = asyncHandler(async (req, res) => {
  const { sessionId, type, message } = req.body

  // Create user message
  const chatMessage = await ChatMessage.create({
    user: req.user ? req.user._id : null,
    sessionId,
    type,
    message,
  })

  // If it's a user message, generate a bot response
  if (type === "user") {
    // Simple bot response logic (in a real app, this would use an AI service)
    const botResponse = generateBotResponse(message)

    // Create bot message
    const botMessage = await ChatMessage.create({
      sessionId,
      type: "bot",
      message: botResponse,
    })

    res.status(201).json([chatMessage, botMessage])
  } else {
    res.status(201).json(chatMessage)
  }
})

// Helper function to generate bot responses
const generateBotResponse = (userMessage) => {
  const userInput = userMessage.toLowerCase()

  if (userInput.includes("hello") || userInput.includes("hi")) {
    return "Hello! How can I assist you with selling your software licenses today?"
  } else if (userInput.includes("how") && userInput.includes("sell")) {
    return "Selling your licenses is easy! Just upload your license details through our secure form, and we'll provide you with a valuation within 24 hours. Once you accept our offer, you'll receive payment within 1-2 business days."
  } else if (userInput.includes("price") || userInput.includes("value") || userInput.includes("worth")) {
    return "The value of your licenses depends on several factors including the software type, version, remaining subscription time, and current market demand. Upload your license details through our form, and we'll provide you with a competitive valuation."
  } else if (userInput.includes("payment") || userInput.includes("pay")) {
    return "We offer multiple payment options including direct bank transfer, PayPal, and cryptocurrency. You can select your preferred method when accepting our offer."
  } else if (userInput.includes("safe") || userInput.includes("secure")) {
    return "Security is our top priority. We use bank-level encryption to protect your data, and our license transfer process is fully compliant with all relevant regulations and terms of service."
  } else if (userInput.includes("time") || userInput.includes("long")) {
    return "Our process is designed to be quick and efficient. You'll typically receive a valuation within 24 hours of submitting your license details, and payment within 1-2 business days after accepting our offer."
  } else if (userInput.includes("thank")) {
    return "You're welcome! Is there anything else I can help you with?"
  } else {
    return "I'd be happy to help with that. For more specific information, please fill out our contact form and one of our license experts will get back to you within 24 hours."
  }
}
