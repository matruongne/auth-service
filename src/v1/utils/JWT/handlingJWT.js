const jwt = require('jsonwebtoken')
const redisClient = require('../../configs/databases/init.redis')
const User = require('../../models/user.model')

const JWT_ACCESS_TOKEN_SECRET = Buffer.from(process.env.JWT_ACCESS_TOKEN_SECRET, 'base64')
const JWT_REFRESH_TOKEN_SECRET = Buffer.from(process.env.JWT_REFRESH_TOKEN_SECRET, 'base64')
const JWT_ACCESS_TOKEN_EXPIRE = process.env.JWT_ACCESS_TOKEN_EXPIRE || '2h'
const JWT_REFRESH_TOKEN_EXPIRE = process.env.JWT_REFRESH_TOKEN_EXPIRE || '7d'
const REDIS_TOKEN_EXPIRE_SECONDS = 7190

//  payloads{ user_id, username, role}

const generateAuthToken = async payloads => {
	let token
	if (!payloads || !payloads.user_id) {
		throw new Error("Payloads must include 'user_id'")
	}

	const user_id = String(payloads.user_id)
	try {
		token = await redisClient.get('user_token:' + user_id)
	} catch (e) {
		console.log('get token from redis failed', e)
	}
	if (!token) {
		token = jwt.sign(
			{ user: { user_id: payloads.user_id, username: payloads.username, email: payloads.email } },
			JWT_ACCESS_TOKEN_SECRET,
			{
				algorithm: 'HS256',
				expiresIn: JWT_ACCESS_TOKEN_EXPIRE,
			}
		)
		await redisClient.set('user_token:' + user_id, token, 'EX', REDIS_TOKEN_EXPIRE_SECONDS)
	}

	return token
}

const generateRefreshTokenAndSaveIfNeeded = async payloads => {
	const existingUser = await User.findOne({ where: { user_id: payloads.user_id } })

	const currentRefreshToken = existingUser.refreshToken

	if (currentRefreshToken) {
		try {
			jwt.verify(currentRefreshToken, JWT_REFRESH_TOKEN_SECRET)
			return currentRefreshToken
		} catch (error) {
			console.log('Existing refresh token is invalid or expired', err.message)
		}
	}
	const newRefreshToken = jwt.sign({ user_id: existingUser.user_id }, JWT_REFRESH_TOKEN_SECRET, {
		algorithm: 'HS256',
		expiresIn: JWT_REFRESH_TOKEN_EXPIRE,
	})

	payloads.refreshToken = newRefreshToken
	await payloads.save()

	return newRefreshToken
}

module.exports = { generateAuthToken, generateRefreshTokenAndSaveIfNeeded }
