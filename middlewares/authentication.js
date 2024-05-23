const jwt = require("jsonwebtoken")
const { StatusCodes } = require("http-status-codes")
const { isTokenValid } = require("../utils")
const { CustomError } = require("./error-handler")

const authenticateUser = async (req, res, next) => {
  const { refreshToken } = req.cookies

  if (!refreshToken) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "No token provided")
  }
  try {
    isTokenValid(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)

    const authHeader = req.headers.authorization
    let accessToken = ""

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new CustomError(StatusCodes.UNAUTHORIZED, "Access token is invalid")
    }
    accessToken = authHeader.substring(7)

    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET
    )
    const { userId, username, email } = decodedToken

    req.user = {
      userId,
      username,
      email,
    }
    next()
  } catch {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Authentication Invalid")
  }
}

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route"
      )
    }
    next()
  }
}

module.exports = {
  authenticateUser,
  authorizePermissions,
}
