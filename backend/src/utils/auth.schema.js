const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().min(2, "name is required"),
  email: z.string().email("valid email is required"),
  password: z.string().min(6, "password must be at least 6 chars"),
});

const loginSchema = z.object({
  email: z.string().email("valid email is required"),
  password: z.string().min(6, "password must be at least 6 chars"),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("valid email is required"),
});

const resetPasswordSchema = z.object({
  token: z.string().min(10, "valid token is required"),
  password: z.string().min(6, "password must be at least 6 chars"),
});

module.exports = { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema };
