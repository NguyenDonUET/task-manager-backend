const { StatusCodes } = require("http-status-codes")
const User = require("../models/users.model")
const { CustomError } = require("../middlewares/error-handler")

const getUser = async (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user })
}

module.exports = { getUser }
