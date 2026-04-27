const express = require("express");
const {
  generateTrip,
  saveTrip,
  getTripById,
  getUserTrips,
  regenerateTripSection,
  getTripVersions,
  restoreTripVersion,
  updateTrip,
  enableSharing,
  disableSharing,
  getSharedTrip,
  editSharedTrip,
} = require("../controllers/trip.controller");
const { requireAuth } = require("../middlewares/auth.middleware");

const router = express.Router();

// ── Public routes (no auth) ──
router.get("/shared/:token", getSharedTrip);
router.patch("/shared/:token", editSharedTrip);

// ── Protected routes (auth required) ──
router.use(requireAuth);
router.post("/generate", generateTrip);
router.post("/save", saveTrip);
router.patch("/:id/regenerate-section", regenerateTripSection);
router.get("/:id/versions", getTripVersions);
router.post("/:id/versions/:versionId/restore", restoreTripVersion);
router.post("/:id/share", enableSharing);
router.delete("/:id/share", disableSharing);
router.patch("/:id", updateTrip);
router.get("/user/me", getUserTrips);
router.get("/:id", getTripById);

module.exports = router;
