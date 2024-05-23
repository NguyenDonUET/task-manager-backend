const { StatusCodes } = require("http-status-codes")
const { CustomError } = require("../middlewares/error-handler")

const checkPermissions = (requestUser, resourceUserId) => {
  console.log(requestUser)
  console.log(resourceUserId)
  if (requestUser.userId === resourceUserId.toString()) return
  throw new CustomError(
    StatusCodes.UNAUTHORIZED,
    "Not authorized to access this route"
  )
}

module.exports = checkPermissions
