const express = require('express')
const router = express.Router()
const authRoute = require('./auth.route')

router.get('/checkstatus', (req, res, next) => {
	res.status(200).json({
		status: 'success',
		message: 'api ok',
	})
})

authRoute(router)

module.exports = router
