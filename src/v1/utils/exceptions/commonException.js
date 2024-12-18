class CommonException extends Error {
	constructor(message, statusCode, errorCode) {
		super(message)
		this.statusCode = statusCode || 500
		this.errorCode = errorCode || 'INTERNAL_SERVER_ERROR'
		Error.captureStackTrace(this, this.constructor)
	}
}

class IncorrectPermission extends CommonException {
	constructor(message, statusCode, errorCode) {
		super(message || 'Do not have permission', statusCode || 403, errorCode || 403)
	}
}

class BadRequestException extends CommonException {
	constructor(message, statusCode, errorCode) {
		super(message || 'Request incorrect', statusCode || 400, errorCode || 400)
	}
}
class TargetNotExistException extends CommonException {
	constructor(message, statusCode, errorCode) {
		super(message || 'Target not exist', statusCode || 404, errorCode || 404)
	}
}

class TargetAlreadyExistException extends CommonException {
	constructor(message, statusCode, errorCode) {
		super(message || 'Target already exist', statusCode || 409, errorCode || 409)
	}
}

module.exports = {
	CommonException,
	IncorrectPermission,
	BadRequestException,
	TargetNotExistException,
	TargetAlreadyExistException,
}
