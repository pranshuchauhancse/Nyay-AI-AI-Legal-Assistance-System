const sendSuccess = (res, data, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    error: null,
  });
};

module.exports = {
  sendSuccess,
};
