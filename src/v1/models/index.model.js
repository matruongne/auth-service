const Role = require('./role.model')
const User = require('./user.model')

Role.hasMany(User, { foreignKey: 'role_id' })
User.belongsTo(Role, { foreignKey: 'role_id' })

module.exports = {
	User,
	Role,
}
