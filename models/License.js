import mongoose from "mongoose"

const licenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    softwareName: {
      type: String,
      required: [true, "Software name is required"],
      trim: true,
    },
    licenseType: {
      type: String,
      required: [true, "License type is required"],
      trim: true,
    },
    licenseKey: {
      type: String,
      required: [true, "License key is required"],
      trim: true,
    },
    expiryDate: {
      type: Date,
    },
    purchaseDate: {
      type: Date,
    },
    originalPrice: {
      type: Number,
    },
    estimatedValue: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "sold"],
      default: "pending",
    },
    offerAmount: {
      type: Number,
    },
    offerAccepted: {
      type: Boolean,
      default: false,
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "paypal", "crypto", ""],
      default: "",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", ""],
      default: "",
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

const License = mongoose.model("License", licenseSchema)

export default License
