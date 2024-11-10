const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {
	generateAuthToken,
	generateRefreshTokenAndSaveIfNeeded,
} = require('../utils/JWT/handlingJWT')
const { User } = require('../models/index.model')
const {
	TargetAlreadyExistException,
	BadRequestException,
} = require('../utils/exceptions/commonException')
const redisClient = require('../configs/databases/init.redis')

const JWT_REFRESH_TOKEN_SECRET = Buffer.from(process.env.JWT_REFRESH_TOKEN_SECRET, 'base64')

class authService {
	async register({ username, password, email }) {
		const existingUser = await User.findOne({ where: { username } })

		if (existingUser) {
			throw new TargetAlreadyExistException()
		}

		const salt = await bcrypt.genSalt(10)
		const passwordHash = await bcrypt.hash(password, salt)
		const newUser = await User.create({ username, password_hash: passwordHash, email, salt })

		const accessToken = await generateAuthToken(newUser)
		const refreshToken = await generateRefreshTokenAndSaveIfNeeded(newUser)

		return {
			accessToken,
			refreshToken,
		}
	}

	async login({ username, password }) {
		const existingUser = await User.findOne({ where: { username } })

		if (!existingUser) {
			throw new TargetNotExistException()
		}
		const isValid = await bcrypt.compare(password, existingUser.password_hash)

		if (!isValid) {
			throw new BadRequestException('Password incorrect')
		}

		const accessToken = await generateAuthToken(existingUser)
		const refreshToken = await generateRefreshTokenAndSaveIfNeeded(existingUser)

		return {
			accessToken,
			refreshToken,
		}
	}

	async refreshToken({ refreshToken }) {
		let user_id
		try {
			const data = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET)
			user_id = data.user_id
		} catch (err) {
			throw new BadRequestException('Invalid token or token expired')
		}

		const user = await User.findOne({ where: { user_id: user_id, refreshToken: refreshToken } })

		if (!user) {
			throw new BadRequestException('Invalid token')
		}

		return await generateAuthToken(user)
	}

	async clearToken({ currentUser }) {
		const user = await User.findOne({ where: { user_id: currentUser.user_id } })
		user.refreshToken = null
		await user.save()
		await redisClient.del('user_' + currentUser.user_id)
	}
}

module.exports = new authService()
