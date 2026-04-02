const errorHandler = (err, req, res, next) => {
  // Express error handler (4 arguments). Log error.
  console.error(`[Error] ${err.message}`);
  if (err.stack) {
    // Optionally log stack for admin/internal use
    console.debug(err.stack);
  }

  // Return 500 JSON with message field. Never expose stack traces in production.
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    status: "error",
    message: message
  });
};

module.exports = errorHandler;
