const authController = require('../controllers/auth.controller')

const authRoute = router => {
	router.post('/register', authController.register)
	router.post('/login', authController.login)
	router.get('/refresh-token', authController.refreshToken)
	router.delete('/logout', authController.logout)
}

module.exports = authRoute
