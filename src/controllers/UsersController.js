const { hash } = require('bcryptjs')

const AppError = require('../utils/AppError')
const knex = require('../database/knex')

class UsersController {
  async create(request, reponse) {
    const { name, email, password } = request.body

    if (!name || !email || !password) {
      throw new AppError('Campo obrigatório não preenchido!')
    }

    const userExists = await knex('users')
      .select('email')
      .where({ email })
      .first()
    console.log(userExists)

    if (userExists) {
      throw new AppError('Este e-mail já está em uso!')
    }

    const hashedPassword = await hash(password, 8)

    await knex('users').insert({ name, email, password: hashedPassword })

    reponse.status(201).json('Usuário cadastrado com sucesso!')
  }
}

module.exports = UsersController
