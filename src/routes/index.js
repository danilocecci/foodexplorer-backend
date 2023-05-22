const { Router } = require('express')

const usersRoutes = require('./users.routes')
const mealsRoutes = require('./meals.routes')
const sessionsRoutes = require('./sessions.routes')

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/meals', mealsRoutes)
routes.use('/sessions', sessionsRoutes)

module.exports = routes
