const express = require("express")
const { getUser } = require("../controllers/userController")
const { authenticateUser } = require("../middlewares/authentication")

const router = express.Router()

router.get("/account", authenticateUser, getUser)

module.exports = router
