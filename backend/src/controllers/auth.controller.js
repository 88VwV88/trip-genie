const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const env = require("../config/env");
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../utils/auth.schema");

function buildToken(user) {
  return jwt.sign({ id: user._id.toString(), email: user.email }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

async function register(req, res, next) {
  try {
    const input = registerSchema.parse(req.body);
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const hash = await bcrypt.hash(input.password, 10);
    const user = await User.create({ ...input, password: hash });
    const token = buildToken(user);

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email },
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const input = loginSchema.parse(req.body);
    const user = await User.findOne({ email: input.email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = buildToken(user);
    return res.json({
      success: true,
      data: { token, user: { id: user._id, name: user.name, email: user.email } },
    });
  } catch (error) {
    return next(error);
  }
}

async function me(req, res) {
  return res.json({ success: true, data: { user: req.user } });
}

async function forgotPassword(req, res, next) {
  try {
    const { email } = forgotPasswordSchema.parse(req.body);
    const user = await User.findOne({ email });

    // Keep response generic to avoid leaking account existence.
    if (!user) {
      return res.json({
        success: true,
        message: "If this email exists, a reset link has been generated.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 1000 * 60 * 15);
    await user.save();

    return res.json({
      success: true,
      message: "Password reset token generated.",
      data: { resetToken: token },
    });
  } catch (error) {
    return next(error);
  }
}

async function resetPassword(req, res, next) {
  try {
    const { token, password } = resetPasswordSchema.parse(req.body);
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return next(error);
  }
}

module.exports = { register, login, me, forgotPassword, resetPassword };
