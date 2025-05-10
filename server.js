import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import licenseRoutes from "./routes/licenses.js"
import userRoutes from "./routes/users.js"
import contactRoutes from "./routes/contacts.js"
import chatRoutes from "./routes/chat.js"
import { errorHandler } from "./middlewares/errorMiddleware.js"

// Load environment variables
dotenv.config()

// Create Express app
const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/licenses", licenseRoutes)
app.use("/api/users", userRoutes)
app.use("/api/contacts", contactRoutes)
app.use("/api/chat", chatRoutes)

// Root route
app.get("/", (req, res) => {
  res.send("SoftSell API is running...")
})

// Error handling middleware
app.use(errorHandler)

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/softsell")
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })

export default app
