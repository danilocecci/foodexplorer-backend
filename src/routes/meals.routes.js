const { Router, response } = require('express')
const multer = require('multer')
const uploadConfig = require('../configs/upload')

const MealsController = require('../controllers/MealsController')
const ensureAuthenticated = require('../middlewares/ensureAuthenticated')

const mealsRoutes = Router()
const upload = multer(uploadConfig.MULTER)
const mealsController = new MealsController()

mealsRoutes.use(ensureAuthenticated)

mealsRoutes.get('/', mealsController.index)
mealsRoutes.get('/:id', mealsController.show)
mealsRoutes.post('/', mealsController.create)
mealsRoutes.delete('/:id', mealsController.delete)
mealsRoutes.patch('/:id', upload.single('image'), mealsController.update)

module.exports = mealsRoutes
