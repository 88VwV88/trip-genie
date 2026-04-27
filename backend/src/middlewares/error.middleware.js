const { ZodError } = require("zod");

function errorHandler(error, req, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues,
    });
  }

  return res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
}

module.exports = { errorHandler };
