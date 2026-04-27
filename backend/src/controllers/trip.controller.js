const Trip = require("../models/trip.model");
const { generateTripPlan } = require("../services/claude.service");
const { generateTripInputSchema, tripSectionSchema, updateTripSchema } = require("../utils/trip.schema");

function mergeSection(currentItinerary, generatedItinerary, section) {
  if (section === "overview" || section === "budget") {
    return {
      ...currentItinerary,
      tripSummary: generatedItinerary.tripSummary || currentItinerary.tripSummary,
    };
  }
  if (section === "itinerary" || section === "top_places" || section === "hotels") {
    return {
      ...currentItinerary,
      days: generatedItinerary.days || currentItinerary.days || [],
    };
  }
  if (section === "tips" || section === "safety") {
    return {
      ...currentItinerary,
      travelTips: generatedItinerary.travelTips || currentItinerary.travelTips || [],
    };
  }
  if (section === "booking_links" || section === "hidden_gems") {
    return currentItinerary;
  }
  return generatedItinerary;
}

async function generateTrip(req, res, next) {
  try {
    const input = generateTripInputSchema.parse({ ...req.body, userId: req.user.id });
    const itinerary = await generateTripPlan(input);

    const trip = await Trip.create({
      userId: input.userId,
      destination: input.destination,
      days: input.days,
      budget: input.budget,
      style: input.style,
      interests: input.interests,
      month: input.month,
      itinerary,
    });

    return res.status(201).json({
      success: true,
      message: "Trip generated successfully",
      data: trip,
    });
  } catch (error) {
    return next(error);
  }
}

async function saveTrip(req, res, next) {
  try {
    const {
      destination,
      days,
      budget,
      style,
      interests = [],
      month,
      itinerary,
    } = req.body;

    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      days,
      budget,
      style,
      interests,
      month,
      itinerary,
    });

    return res.status(201).json({
      success: true,
      message: "Trip saved successfully",
      data: trip,
    });
  } catch (error) {
    return next(error);
  }
}

async function getTripById(req, res, next) {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found",
      });
    }
    return res.json({ success: true, data: trip });
  } catch (error) {
    return next(error);
  }
}

async function getUserTrips(req, res, next) {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.json({ success: true, data: trips });
  } catch (error) {
    return next(error);
  }
}

async function regenerateTripSection(req, res, next) {
  try {
    const { section } = req.body;
    const parsedSection = tripSectionSchema.safeParse(section);
    if (!parsedSection.success) {
      return res.status(400).json({ success: false, message: "Invalid section requested" });
    }

    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    const input = generateTripInputSchema.parse({
      userId: req.user.id,
      destination: trip.destination,
      days: trip.days,
      budget: trip.budget,
      style: trip.style,
      interests: trip.interests,
      month: trip.month,
    });

    const regenerated = await generateTripPlan(input, { section: parsedSection.data });
    trip.itinerary = mergeSection(trip.itinerary || {}, regenerated, parsedSection.data);
    await trip.save();

    return res.json({ success: true, message: "Section regenerated", data: trip });
  } catch (error) {
    return next(error);
  }
}

async function updateTrip(req, res, next) {
  try {
    const updates = updateTripSchema.parse(req.body);
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    if (updates.destination) {
      trip.destination = updates.destination;
    }
    if (updates.month) {
      trip.month = updates.month;
    }

    if (updates.itinerary) {
      trip.itinerary = {
        ...(trip.itinerary || {}),
        ...updates.itinerary,
      };
    }

    // Record edit in history if editorName is provided
    if (req.body.editEntry) {
      trip.editHistory.push({
        editorName: req.body.editEntry.editorName || req.user.name || "Owner",
        section: req.body.editEntry.section || "general",
        description: req.body.editEntry.description || "Updated trip details",
      });
    }

    await trip.save();
    return res.json({ success: true, message: "Trip updated successfully", data: trip });
  } catch (error) {
    return next(error);
  }
}

// ── Sharing endpoints ──

async function enableSharing(req, res, next) {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    if (!trip.shareToken) {
      trip.generateShareToken();
    } else {
      trip.isPublic = true;
    }
    await trip.save();

    return res.json({
      success: true,
      message: "Sharing enabled",
      data: { shareToken: trip.shareToken, isPublic: trip.isPublic },
    });
  } catch (error) {
    return next(error);
  }
}

async function disableSharing(req, res, next) {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Trip not found" });
    }

    trip.isPublic = false;
    await trip.save();

    return res.json({ success: true, message: "Sharing disabled" });
  } catch (error) {
    return next(error);
  }
}

// Public (no auth required) -- get shared trip by token
async function getSharedTrip(req, res, next) {
  try {
    const trip = await Trip.findOne({ shareToken: req.params.token, isPublic: true });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Shared trip not found or link has been disabled" });
    }
    return res.json({ success: true, data: trip });
  } catch (error) {
    return next(error);
  }
}

// Public (no auth required) -- edit shared trip + record change
async function editSharedTrip(req, res, next) {
  try {
    const trip = await Trip.findOne({ shareToken: req.params.token, isPublic: true });
    if (!trip) {
      return res.status(404).json({ success: false, message: "Shared trip not found or link has been disabled" });
    }

    const { editorName, section, description, updates } = req.body;

    if (!editorName || !editorName.trim()) {
      return res.status(400).json({ success: false, message: "editorName is required to make edits" });
    }

    // Apply itinerary updates
    if (updates && updates.itinerary) {
      trip.itinerary = {
        ...(trip.itinerary || {}),
        ...updates.itinerary,
      };
    }
    if (updates && updates.destination) {
      trip.destination = updates.destination;
    }
    if (updates && updates.month) {
      trip.month = updates.month;
    }

    // Record the edit
    trip.editHistory.push({
      editorName: editorName.trim(),
      section: section || "general",
      description: description || "Made changes to the trip",
      timestamp: new Date(),
    });

    await trip.save();

    return res.json({ success: true, message: "Trip updated", data: trip });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  generateTrip,
  saveTrip,
  getTripById,
  getUserTrips,
  regenerateTripSection,
  updateTrip,
  enableSharing,
  disableSharing,
  getSharedTrip,
  editSharedTrip,
};
