const mongoose = require("mongoose");
const crypto = require("crypto");

const EditEntrySchema = new mongoose.Schema(
  {
    editorName: { type: String, required: true, trim: true },
    section: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const TripSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    days: {
      type: Number,
      required: true,
      min: 1,
      max: 30,
    },
    budget: {
      type: String,
      required: true,
      trim: true,
    },
    style: {
      type: String,
      required: true,
      trim: true,
    },
    interests: {
      type: [String],
      default: [],
    },
    month: {
      type: String,
      required: true,
      trim: true,
    },
    itinerary: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // ── Sharing ──
    shareToken: {
      type: String,
      default: null,
      unique: true,
      sparse: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    editHistory: {
      type: [EditEntrySchema],
      default: [],
    },
  },
  { timestamps: true }
);

TripSchema.methods.generateShareToken = function () {
  this.shareToken = crypto.randomBytes(16).toString("hex");
  this.isPublic = true;
  return this.shareToken;
};

module.exports = mongoose.model("Trip", TripSchema);
