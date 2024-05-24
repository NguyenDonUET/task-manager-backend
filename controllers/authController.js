const { StatusCodes } = require("http-status-codes")
const { attachCookiesToResponse, createTokenUser } = require("../utils")
const User = require("../models/users.model")
const { CustomError, BadRequestError } = require("../middlewares/error-handler")
const { createTokenJWT, isTokenValid } = require("../utils/jwt")

const register = async (req, res) => {
  const { email, username, password } = req.body

  if (!email || !username || !password) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Dữ liệu không hợp lệ")
  }

  const emailAlreadyExists = await User.findOne({ email })
  if (emailAlreadyExists) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Email này đã tồn tại")
  }

  await User.create({
    username,
    email,
    password,
  })

  res.status(StatusCodes.CREATED).json({
    msg: "Đăng ký thành công!",
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Dữ liệu không hợp lệ")
  }
  const user = await User.findOne({ email })

  if (!user) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Tài khoản này chưa tồn tại")
  }
  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Mật khẩu không đúng")
  }

  const tokenUser = createTokenUser(user)

  const accessToken = createTokenJWT({
    payload: tokenUser,
    secretKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiredTime: process.env.JWT_ACCESS_TOKEN_TTL,
  })

  const refreshToken = createTokenJWT({
    payload: tokenUser,
    expiredTime: process.env.JWT_REFRESH_TOKEN_TTL,
    secretKey: process.env.JWT_REFRESH_TOKEN_SECRET,
  })

  // Gửi refresh token qua cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Hết hạn sau 30 ngày
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  })

  res.status(StatusCodes.OK).json({ msg: "Đăng nhập thành công!", accessToken })
}

const logout = async (req, res) => {
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  })

  res.status(StatusCodes.OK).json({ msg: "user logged out!" })
}

const handleRefreshToken = async (req, res) => {
  const { refreshToken } = req.cookies

  const userInfo = isTokenValid(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET
  )
  const user = await User.findOne({ _id: userInfo.userId })

  if (!user) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "refresh token vail")
  }
  const tokenUser = createTokenUser(user)
  const accessToken = createTokenJWT({
    payload: tokenUser,
    secretKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    expiredTime: process.env.JWT_ACCESS_TOKEN_TTL,
  })
  const newRefreshToken = createTokenJWT({
    payload: tokenUser,
    expiredTime: process.env.JWT_REFRESH_TOKEN_TTL,
    secretKey: process.env.JWT_REFRESH_TOKEN_SECRET,
  })

  // Gửi refresh token qua cookie
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Hết hạn sau 30 ngày
  })

  res.status(StatusCodes.OK).json({
    msg: "refresh token success!",
    accessToken,
  })
}

module.exports = {
  register,
  login,
  logout,
  handleRefreshToken,
}
