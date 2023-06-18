const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class MealsController {
  async create(request, response) {
    const { category, name, description, price, ingredients } = request.body

    const mealExists = await knex('meals').where({ name }).first()

    if (mealExists) {
      throw new AppError('Este prato já está no cardápio!')
    }

    const imageFilename = request.file.filename
    const diskStorage = new DiskStorage()
    const filename = await diskStorage.saveFile(imageFilename)

    const [meal_id] = await knex('meals').insert({
      image: filename,
      name,
      category,
      description,
      price
    })

    const ingredientsToInsert = ingredients.map(ingredient => {
      return {
        name: ingredient,
        meal_id
      }
    })

    await knex('ingredients').insert(ingredientsToInsert)

    response.status(201).json()
  }

  async show(request, response) {
    const { id } = request.params

    const meal = await knex('meals').where({ id }).first()
    const ingredients = await knex('ingredients')
      .where({ meal_id: id })
      .orderBy('name')

    return response.json({ ...meal, ingredients })
  }

  async delete(request, response) {
    const { id } = request.params

    await knex('meals').where({ id }).delete()

    return response.json('Prato excluído com sucesso!')
  }

  async index(request, response) {
    const { searchTerm } = request.query

    const meals = await knex('ingredients')
      .select([
        'meals.id',
        'meals.image',
        'meals.category',
        'meals.name',
        'meals.description',
        'meals.price'
      ])
      .whereLike('meals.name', `%${searchTerm}%`)
      .orWhereLike('ingredients.name', `%${searchTerm}%`)
      .innerJoin('meals', 'meals.id', 'ingredients.meal_id')
      .orderBy('meals.name')
      .distinct()

    return response.json(meals)
  }

  async update(request, response) {
    const { id } = request.params
    const { image, category, name, ingredients, description, price } =
      request.body
    const imageFilename = request.file.filename
    const diskStorage = new DiskStorage()

    const meal = await knex('meals').where({ id }).first()

    if (!meal) {
      throw new AppError('Este prato não existe!')
    }

    if (meal.image) {
      await diskStorage.deleteFile(meal.image)
    }

    const filename = await diskStorage.saveFile(imageFilename)

    meal.image = image ?? filename
    meal.category = category ?? meal.category
    meal.name = name ?? meal.name
    meal.description = description ?? meal.description
    meal.price = price ?? meal.price

    const updatedMeal = await knex('meals').where({ id }).update(meal)

    if (!ingredients) {
      return response.json({ updatedMeal })
    }

    const ingredientsToInsert = ingredients.map(ingredient => {
      return { meal_id: id, name: ingredient }
    })

    await knex('ingredients').where({ meal_id: id }).delete()
    const [updatedIngredients] = await knex('ingredients')
      .where({ meal_id: id })
      .insert(ingredientsToInsert)

    return response.json({ updatedMeal, updatedIngredients })
  }
}

module.exports = MealsController
