const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found.`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statuscode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statuscode);
  res.json({
    message: err.message.replace(/^Error: /, ""),
    stack: process.env.NODE_ENV === "development" ? err?.stack : undefined
  });
};

module.exports = { errorHandler, notFound };
