const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const errFieldObj = err.keyValue;
  const errField = Object.keys(errFieldObj)[0];
  const errValue = Object.values(errFieldObj)[0];
  const message = `Duplicate [${errField}] value [${errValue}].`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((error) => error.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError(`Invalid JWT token`, 401);

const handleJWTExpiredError = () => new AppError(`JWT token has expired`, 401);

const sendErrorForDev = (err, req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Application Error',
      msg: err.message,
    });
  }
};

const sendErrorForProd = (err, req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.error('Error ', err);

    return res.status(500).json({
      status: 'error',
      message: 'Server Error',
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Application Error',
      msg: err.message,
    });
  }

  console.error('Error ', err);

  return res.status(err.statusCode).render('error', {
    title: 'Server Error',
    msg: 'Server is currently unavailable',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, req, res, next);
  } else if (process.env.NODE_ENV === 'production') {
    let modifiedErr = Object.create(err);
    if (modifiedErr.name === 'CastError') {
      modifiedErr = handleCastErrorDB(modifiedErr);
    }
    if (modifiedErr.code === 11000) {
      modifiedErr = handleDuplicateErrorDB(modifiedErr);
    }
    if (modifiedErr.name === 'ValidationError') {
      modifiedErr = handleValidationErrorDB(modifiedErr);
    }
    if (modifiedErr.name === 'JsonWebTokenError') {
      modifiedErr = handleJWTError();
    }
    if (modifiedErr.name === 'TokenExpiredError') {
      modifiedErr = handleJWTExpiredError();
    }
    sendErrorForProd(modifiedErr, req, res, next);
  }
};
