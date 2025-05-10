import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/User.js"
import License from "./models/License.js"
import Contact from "./models/Contact.js"
import ChatMessage from "./models/ChatMessage.js"

// Load environment variables
dotenv.config()

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/softsell")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err))

// Sample data
const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    company: "SoftSell",
    role: "admin",
    isVerified: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    company: "Tech Corp",
    role: "user",
    isVerified: true,
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    company: "Design Studio",
    role: "user",
    isVerified: true,
  },
]

const licenses = [
  {
    softwareName: "Adobe Creative Cloud",
    licenseType: "Enterprise",
    licenseKey: "ADOBE-CC-1234-5678-9012",
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000), // 180 days from now
    purchaseDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), // 180 days ago
    originalPrice: 1200,
    estimatedValue: 800,
    status: "pending",
  },
  {
    softwareName: "Microsoft Office 365",
    licenseType: "Business Premium",
    licenseKey: "MS-O365-2345-6789-0123",
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    purchaseDate: new Date(Date.now() - 270 * 24 * 60 * 60 * 1000), // 270 days ago
    originalPrice: 850,
    estimatedValue: 450,
    status: "approved",
    offerAmount: 400,
  },
  {
    softwareName: "Autodesk AutoCAD",
    licenseType: "Professional",
    licenseKey: "ACAD-3456-7890-1234",
    expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // 120 days from now
    purchaseDate: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000), // 240 days ago
    originalPrice: 1450,
    estimatedValue: 900,
    status: "sold",
    offerAmount: 850,
    offerAccepted: true,
    paymentMethod: "bank_transfer",
    paymentStatus: "completed",
  },
]

const contacts = [
  {
    name: "Michael Johnson",
    email: "michael@example.com",
    company: "Johnson Enterprises",
    licenseType: "adobe",
    message:
      "I have 5 Adobe Creative Cloud licenses that I would like to sell. They expire in 6 months. Can you provide a valuation?",
    status: "new",
  },
  {
    name: "Sarah Williams",
    email: "sarah@example.com",
    company: "Williams Design",
    licenseType: "microsoft",
    message: "We are downsizing and have 10 Microsoft Office licenses we no longer need. Looking for the best offer.",
    status: "in_progress",
  },
]

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany()
    await License.deleteMany()
    await Contact.deleteMany()
    await ChatMessage.deleteMany()

    // Insert users
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id
    const regularUser1 = createdUsers[1]._id
    const regularUser2 = createdUsers[2]._id

    // Add user references to licenses
    const sampleLicenses = [
      { ...licenses[0], user: regularUser1 },
      { ...licenses[1], user: regularUser1 },
      { ...licenses[2], user: regularUser2 },
    ]

    // Insert licenses
    await License.insertMany(sampleLicenses)

    // Add assignedTo to contacts
    const sampleContacts = [{ ...contacts[0], assignedTo: adminUser }, { ...contacts[1] }]

    // Insert contacts
    await Contact.insertMany(sampleContacts)

    console.log("Data imported!")
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

// Destroy data
const destroyData = async () => {
  try {
    await User.deleteMany()
    await License.deleteMany()
    await Contact.deleteMany()
    await ChatMessage.deleteMany()

    console.log("Data destroyed!")
    process.exit()
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

// Run script based on command line argument
if (process.argv[2] === "-d") {
  destroyData()
} else {
  importData()
}
