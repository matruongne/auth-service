const express = require('express')
const router = express.Router()
const authRouter = require('./auth.router')

router.get('/checkstatus', (req, res, next) => {
	res.status(200).json({
		status: 'success',
		message: 'api ok',
	})
})

authRouter(router)

module.exports = router
