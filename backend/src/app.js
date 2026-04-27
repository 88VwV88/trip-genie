const express = require("express");
const cors = require("cors");
const tripRoutes = require("./routes/trip.routes");
const authRoutes = require("./routes/auth.routes");
const { errorHandler } = require("./middlewares/error.middleware");
const env = require("./config/env");

const app = express();

const configuredOrigins = (env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const devOrigins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"];

const allowedOrigins = new Set([...configuredOrigins, ...devOrigins]);

const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (no Origin) and explicit browser origins.
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Trip Genie API healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use(errorHandler);

module.exports = app;
