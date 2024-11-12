const jwt = require('jsonwebtoken')
const redisClient = require('../configs/databases/init.redis')

const authenticateToken = async (req, res, next) => {
	try {
		token = await redisClient.get('user_token:' + user_id)
	} catch (e) {
		console.log('get token from redis failed:', e.message)
		return res.sendStatus(403)
	}
	jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403)
		req.user = user
		next()
	})
}

module.exports = authenticateToken
