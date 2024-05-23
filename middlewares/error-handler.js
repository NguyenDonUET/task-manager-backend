const { StatusCodes } = require("http-status-codes")

class CustomError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

// Middleware xử lý lỗi
const errorHandlerMiddleware = (err, req, res, next) => {
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR
  const message = err.message || "Internal Server Error"

  // Xử lý lỗi validate của MongoDB
  if (err.name === "ValidationError") {
    // Lỗi validate: ví dụ, thiếu trường bắt buộc
    const validationErrors = Object.keys(err.errors).map(
      (field) => err.errors[field].message
    )
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      errors: validationErrors,
    })
  }

  // Xử lý các lỗi khác
  res.status(status).json({
    success: false,
    msg: message,
  })
}

module.exports = errorHandlerMiddleware

class UnauthenticatedError extends CustomError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.UNAUTHORIZED
  }
}

class BadRequestError extends CustomError {
  constructor(message) {
    super(message)
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

module.exports = {
  errorHandlerMiddleware,
  CustomError,
  UnauthenticatedError,
  BadRequestError,
}

// const errorHandlerMiddleware = (err, req, res, next) => {
//   let customError = {
//     // set default
//     statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
//     msg: err.message || "Something went wrong try again later",
//   }
//   if (err.name === "ValidationError") {
//     customError.msg = Object.values(err.errors)
//       .map((item) => item.message)
//       .join(",")
//     customError.statusCode = 400
//   }
//   if (err.code && err.code === 11000) {
//     customError.msg = `Duplicate value entered for ${Object.keys(
//       err.keyValue
//     )} field, please choose another value`
//     customError.statusCode = 400
//   }
//   if (err.name === "CastError") {
//     customError.msg = `No item found with id : ${err.value}`
//     customError.statusCode = 404
//   }

//   return res.status(customError.statusCode).json({ msg: customError.msg })
// }
