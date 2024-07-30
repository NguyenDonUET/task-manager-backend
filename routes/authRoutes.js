const express = require('express')
const router = express.Router()
const {
  register,
  login,
  logout,
  handleRefreshToken,
} = require('../controllers/authController')
const { isAuthorized } = require('../middlewares/authentication')

router.post('/register', register)
router.post('/login', login)
router.get('/refresh-token', handleRefreshToken)
router.get('/logout', isAuthorized, logout)

module.exports = router
