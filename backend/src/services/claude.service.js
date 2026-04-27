const Anthropic = require("@anthropic-ai/sdk");
const env = require("../config/env");
const { itinerarySchema } = require("../utils/trip.schema");

const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

function extractJsonText(rawText) {
  if (rawText.startsWith("{") && rawText.endsWith("}")) {
    return rawText;
  }

  const fencedJsonMatch = rawText.match(/```json\s*([\s\S]*?)```/i);
  if (fencedJsonMatch && fencedJsonMatch[1]) {
    return fencedJsonMatch[1].trim();
  }

  const genericFenceMatch = rawText.match(/```\s*([\s\S]*?)```/);
  if (genericFenceMatch && genericFenceMatch[1]) {
    return genericFenceMatch[1].trim();
  }

  return rawText;
}

function buildPrompt(input, options = {}) {
  const { destination, days, budget, style, interests, month } = input;
  const { section = "full" } = options;
  const taskLine =
    section === "full"
      ? "Create a deeply detailed travel plan."
      : `Regenerate only the "${section}" section while keeping the rest coherent.`;

  return `You are an expert AI travel planner.

Your task is to generate a complete travel itinerary based on the user's preferences.

You must return STRICT JSON with no explanation outside JSON.

USER INPUT:
Destination: ${destination}
Days: ${days}
Budget: ${budget}
Travel Style: ${style} (luxury, budget, backpacking, family)
Interests: ${interests.join(", ")}
Travel Month: ${month}

TASK:
${taskLine}

The itinerary must include:
1. A detailed trip summary
2. Day-wise plans with multiple activities per day
3. Proper timing and estimated duration for each activity
4. Travel time between locations
5. Restaurant recommendations for each day
6. Cultural and practical daily tips
7. Estimated cost where possible
8. Coordinates for each activity
9. 3-5 real image URLs for each activity
10. 1-5 real image URLs for each restaurant
11. Travel tips for the overall trip

JSON FORMAT (must match exactly):
{
  "tripSummary": {
    "destination": "",
    "totalDays": "",
    "description": "",
    "estimatedBudget": ""
  },
  "days": [
    {
      "day": 1,
      "date": "",
      "theme": "",
      "activities": [
        {
          "time": "",
          "locationName": "",
          "description": "",
          "category": "",
          "estimatedDuration": "",
          "estimatedCost": "",
          "travelTimeFromPrevious": "",
          "coordinates": {
            "lat": "",
            "lng": ""
          },
          "images": ["", "", ""]
        }
      ],
      "restaurants": [
        {
          "name": "",
          "speciality": "",
          "priceRange": "",
          "images": ["", "", ""]
        }
      ],
      "dailyTips": ""
    }
  ],
  "travelTips": []
}

IMPORTANT RULES:
1. Only output JSON
2. No markdown
3. No explanation
4. Use realistic travel suggestions with local context
5. Include real, directly usable image URLs from reliable sources like Unsplash, Wikimedia, official tourism websites, or Google Maps photos pages
6. Ensure at least 3 activities per day where practical
7. Ensure each activity includes valid latitude and longitude values
8. Ensure each date in the trip range has exactly one day object`;
}

function normalizeLegacyItinerary(itinerary, input) {
  if (!itinerary || typeof itinerary !== "object") {
    return itinerary;
  }
  if (itinerary.tripSummary && Array.isArray(itinerary.days)) {
    return {
      ...itinerary,
      days: itinerary.days.map((day, index) => ({
        ...day,
        day: Number(day.day) || index + 1,
        activities: Array.isArray(day.activities)
          ? day.activities.map((activity) => ({
              ...activity,
              coordinates: {
                lat: Number(activity?.coordinates?.lat || 0),
                lng: Number(activity?.coordinates?.lng || 0),
              },
              images: Array.isArray(activity.images)
                ? activity.images.filter((url) => typeof url === "string" && /^https?:\/\//i.test(url)).slice(0, 5)
                : [],
            }))
          : [],
        restaurants: Array.isArray(day.restaurants)
          ? day.restaurants.map((restaurant) => ({
              ...restaurant,
              images: Array.isArray(restaurant.images)
                ? restaurant.images.filter((url) => typeof url === "string" && /^https?:\/\//i.test(url)).slice(0, 5)
                : [],
            }))
          : [],
      })),
      travelTips: Array.isArray(itinerary.travelTips) ? itinerary.travelTips : [],
    };
  }

  const itineraryDays = Array.isArray(itinerary.itinerary) ? itinerary.itinerary : [];
  const normalizedDays = itineraryDays.map((dayItem, index) => ({
    day: dayItem.day || index + 1,
    date: "",
    theme: dayItem.title || `Day ${index + 1}`,
    activities: (dayItem.activities || []).map((activity) => ({
      time: activity.time || "Flexible",
      locationName: activity.place || "Planned activity",
      description: activity.description || "",
      category: "sightseeing",
      estimatedDuration: "",
      estimatedCost: activity.cost_estimate || "",
      travelTimeFromPrevious: "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
      images: [],
    })),
    restaurants: (dayItem.food_recommendations || []).map((restaurant) => ({
      name: restaurant.restaurant || "Recommended restaurant",
      speciality: restaurant.dish || "",
      priceRange: "",
      images: [],
    })),
    dailyTips: "",
  }));

  return {
    tripSummary: {
      destination: itinerary.destination || input.destination,
      totalDays: String(input.days),
      description: itinerary.overview || "",
      estimatedBudget: itinerary.estimated_budget?.total_estimate || input.budget || "",
    },
    days: normalizedDays,
    travelTips: itinerary.travel_tips || [],
  };
}

async function generateTripPlan(input, options = {}) {
  const prompt = buildPrompt(input, options);

  const message = await anthropic.messages.create({
    model: env.ANTHROPIC_MODEL,
    max_tokens: 4000,
    temperature: 0.3,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n")
    .trim();

  let parsed;
  try {
    parsed = JSON.parse(extractJsonText(text));
  } catch (error) {
    throw new Error("Claude returned non-JSON output");
  }

  const validated = itinerarySchema.safeParse(normalizeLegacyItinerary(parsed, input));
  if (!validated.success) {
    throw new Error("Claude JSON did not match itinerary schema");
  }

  return validated.data;
}

module.exports = { generateTripPlan };
