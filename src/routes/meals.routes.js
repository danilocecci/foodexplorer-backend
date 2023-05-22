const { Router } = require('express')

const MealsController = require('../controllers/MealsController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const mealsRoutes = Router()
const mealsController = new MealsController()

mealsRoutes.use(ensureAuthenticated)

mealsRoutes.get('/', mealsController.index)
mealsRoutes.get('/:id', mealsController.show)
mealsRoutes.post('/', mealsController.create)
mealsRoutes.delete('/:id', mealsController.delete)
mealsRoutes.patch('/:id', mealsController.update)

module.exports = mealsRoutes
