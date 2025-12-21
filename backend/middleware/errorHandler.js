const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error] Status: ${statusCode}, Message: ${message}`);

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

export default errorHandler
