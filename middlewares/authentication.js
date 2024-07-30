const jwt = require('jsonwebtoken')
const { StatusCodes } = require('http-status-codes')
const { isTokenValid } = require('../utils')
const { CustomError } = require('./error-handler')

const isAuthorized = async (req, res, next) => {
  const { accessToken } = req.cookies

  if (!accessToken) {
    throw new CustomError(StatusCodes.FORBIDDEN, 'No token provided')
  }
  try {
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
  } catch (error) {
    console.log('Error from auth', error)
    // TH accesstoken hết hạn
    if (error.message?.includes('jwt expired')) {
      return res
        .status(StatusCodes.GONE)
        .json({ message: 'access token expired!' })
    }
    // TH lỗi khác
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'please login again' })
    // throw new CustomError(StatusCodes.UNAUTHORIZED, 'Access token is invalid')
  }
}

module.exports = {
  isAuthorized,
}
