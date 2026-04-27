const mongoose = require("mongoose");

const VersionSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
      index: true,
    },
    versionNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    baseVersionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Version",
      default: null,
    },
    feedback: {
      type: String,
      default: null,
      trim: true,
    },
  },
  { timestamps: true }
);

VersionSchema.index({ tripId: 1, versionNumber: 1 }, { unique: true });

const Version = mongoose.model("Version", VersionSchema);

Version.syncIndexes().catch((error) => {
  console.error("Failed to sync Version indexes:", error);
});

module.exports = Version;
