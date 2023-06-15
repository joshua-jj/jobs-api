import { StatusCodes } from 'http-status-codes';
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    message: err.message || 'Something went wrong, try again later',
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
  };

  if (err.name === 'ValidationError') {
    customError.message = `${Object.values(err.errors).map(
      item => item.message
    ).join(', ')}`;
    customError.statusCode = 400;
  }

  if (err.code === 11000) {
    customError.message = `${Object.keys(err.keyValue)} already exists`;
    customError.statusCode = 409;
  }

    if (err.name === 'CastError') {
      customError.message = `No job found with id ${err.value}`;
      customError.statusCode = 404;
    }
  // return res
  //   .status(StatusCodes.INTERNAL_SERVER_ERROR)
  //   .json({ statusCode: err.statusCode, err });
  return res
    .status(customError.statusCode)
    .json({ statusCode: customError.statusCode, message: customError.message });
};

export default errorHandlerMiddleware;
