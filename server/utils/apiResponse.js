const sendSuccess = (res, data = {}, statusCode = 200, message = 'OK') => {
  res.status(statusCode).json({
    success: true,
    data,
    message,
  });
};

module.exports = {
  sendSuccess,
};
