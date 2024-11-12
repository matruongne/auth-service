const BasicController = require('../utils/controllers/basicController')
const bindMethodsWithThisContext = require('../utils/classes/bindMethodsWithThisContext')
const authService = require('../services/auth.service')
class AuthController extends BasicController {
	constructor() {
		super()
		bindMethodsWithThisContext(this)
	}

	async register(req, res) {
		try {
			const { accessToken, refreshToken } = await authService.register(req.body)

			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'Strict',
				maxAge: process.env.REFRESH_TOKEN_MAX_AGE_MILLISECONDS,
			})

			res.cookie('accessToken', accessToken, {
				httpOnly: true,
				sameSite: 'Strict',
				maxAge: process.env.ACCESS_TOKEN_MAX_AGE_MILLISECONDS,
			})

			return res.status(201).json({ message: 'User registered successfully!', token: accessToken })
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}

	async login(req, res) {
		try {
			const { accessToken, refreshToken } = await authService.login(req.body)
			res.cookie('refreshToken', refreshToken, {
				httpOnly: true,
				sameSite: 'Strict',
				maxAge: process.env.REFRESH_TOKEN_MAX_AGE_MILLISECONDS,
			})

			res.cookie('accessToken', accessToken, {
				httpOnly: true,
				sameSite: 'Strict',
				maxAge: process.env.ACCESS_TOKEN_MAX_AGE_MILLISECONDS,
			})

			return res.json({ token: accessToken })
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}

	async refreshToken(req, res) {
		try {
			const token = await authService.refreshToken(req.cookies)

			return res.status(200).json(token)
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}

	async logout(req, res) {
		try {
			await authService.clearToken(req.body)
			res.clearCookie('refreshToken', {
				httpOnly: true,
				sameSite: 'Strict',
			})

			return res.json({
				message: `User ${req.body.currentUser.user_id} has been logged out success`,
			})
		} catch (error) {
			return this.handleResponseError(res, error)
		}
	}
}

module.exports = new AuthController()
