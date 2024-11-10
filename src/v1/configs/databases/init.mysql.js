const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('online_cinema_booking', 'root', '1', {
	host: 'localhost',
	port: 3306,
	dialect: 'mysql',
	logging: false,
})

sequelize
	.authenticate()
	.then(() => console.log('Connect to database sequelize(sql) successfully.'))
	.catch(error => console.error('Unable to connect to the database:', error))

// Sync Database
sequelize
	.sync({ force: false, alter: false })
	.then(() => console.log('Database synced'))
	.catch(err => console.log('Error syncing database:', err))

module.exports = { sequelize }
