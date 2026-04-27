const { z } = require("zod");

const generateTripInputSchema = z.object({
  userId: z.string().min(1, "userId is required"),
  destination: z.string().min(2, "destination is required"),
  days: z.coerce.number().int().min(1).max(30),
  budget: z.string().min(1, "budget is required"),
  interests: z.array(z.string()).default([]),
  style: z.enum(["luxury", "budget", "backpacking", "family"]),
  month: z.string().min(2, "month is required"),
});

const tripSectionSchema = z.enum([
  "overview",
  "top_places",
  "itinerary",
  "hotels",
  "budget",
  "tips",
  "safety",
  "booking_links",
  "hidden_gems",
]);

const coordinateSchema = z.object({
  lat: z.union([z.number(), z.string()]).transform((value) => Number(value)),
  lng: z.union([z.number(), z.string()]).transform((value) => Number(value)),
});

const activitySchema = z.object({
  time: z.string(),
  locationName: z.string(),
  description: z.string(),
  category: z.string(),
  estimatedDuration: z.string(),
  estimatedCost: z.string(),
  travelTimeFromPrevious: z.string().optional().default(""),
  coordinates: coordinateSchema,
  images: z.array(z.string().url()).max(5).default([]),
});

const restaurantSchema = z.object({
  name: z.string(),
  speciality: z.string(),
  priceRange: z.string(),
  images: z.array(z.string().url()).max(5).default([]),
});

const itinerarySchema = z.object({
  tripSummary: z.object({
    destination: z.string(),
    totalDays: z.union([z.string(), z.number()]).transform((value) => String(value)),
    description: z.string(),
    estimatedBudget: z.string(),
  }),
  days: z.array(
    z.object({
      day: z.number().int().min(1),
      date: z.string(),
      theme: z.string(),
      activities: z.array(activitySchema).min(1),
      restaurants: z.array(restaurantSchema).default([]),
      dailyTips: z.string(),
    })
  ),
  travelTips: z.array(z.string()).default([]),
});

const updateTripSchema = z.object({
  destination: z.string().min(2).optional(),
  month: z.string().min(2).optional(),
  itinerary: z.record(z.any()).optional(),
});

module.exports = { generateTripInputSchema, itinerarySchema, tripSectionSchema, updateTripSchema };
