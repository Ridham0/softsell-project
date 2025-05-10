import jwt from "jsonwebtoken"

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "softsell_secret_key", {
    expiresIn: "30d",
  })
}

export default generateToken
