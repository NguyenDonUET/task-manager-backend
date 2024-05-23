const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")

const createTokenJWT = ({ payload, secretKey, expiredTime }) => {
  const token = jwt.sign(payload, secretKey, {
    expiresIn: expiredTime,
  })
  return token
}

const isTokenValid = (token, secretKey) => jwt.verify(token, secretKey)

const attachCookiesToResponse = ({ res, refreshTokenJWT }) => {
  const oneMonth = 1000 * 60 * 60 * 24 * 30 // 30 days

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneMonth),
    secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  })
}

module.exports = {
  createTokenJWT,
  isTokenValid,
  attachCookiesToResponse,
}
