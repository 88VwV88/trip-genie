const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const env = require("../config/env");

async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    req.user = { id: user._id.toString(), name: user.name, email: user.email };
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
}

module.exports = { requireAuth };
