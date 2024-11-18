const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth.controller')
const isAuth = require('../middlewares/isAuth')

router.post('/register', authController.register)
router.post('/verify', authController.verifyAccount)
router.post('/resend-verification-code', authController.resendVerificationCode)
router.post('/login', authController.login)
router.get('/refresh-token', authController.refreshToken)

router.use(isAuth)
router.delete('/logout', authController.logout)

module.exports = router
