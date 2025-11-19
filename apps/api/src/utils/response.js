// Response helpers to match frontend expectations

const success = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

const error = (res, message = 'Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    error: message,
    message,
    errors
  });
};

const created = (res, data = null, message = 'Created successfully') => {
  return success(res, data, message, 201);
};

const badRequest = (res, message = 'Bad request', errors = null) => {
  return error(res, message, 400, errors);
};

const unauthorized = (res, message = 'Unauthorized') => {
  return error(res, message, 401);
};

const forbidden = (res, message = 'Forbidden') => {
  return error(res, message, 403);
};

const notFound = (res, message = 'Not found') => {
  return error(res, message, 404);
};

const conflict = (res, message = 'Conflict') => {
  return error(res, message, 409);
};

module.exports = {
  success,
  error,
  created,
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  conflict
};