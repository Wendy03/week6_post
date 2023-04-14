const successHandler = (res, message, data, statusCode = 200) => {
  res.status(statusCode).json({
    status: 'success',
    message: message,
    data: data,
  });
};

module.exports = successHandler;
