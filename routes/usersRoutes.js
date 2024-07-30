const express = require('express')
const { getUser } = require('../controllers/userController')
const { isAuthorized } = require('../middlewares/authentication')

const router = express.Router()

router.get('/account', isAuthorized, getUser)

module.exports = router
