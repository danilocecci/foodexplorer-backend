const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const authConfig = require('../configs/auth')
const { compare } = require('bcryptjs')
const { sign } = require('jsonwebtoken')

class SessionsController {
  async create(request, response) {
    const { email, password } = request.body

    const user = await knex('users').where({ email }).first()
    const checkedPassword = user
      ? await compare(password, user.password)
      : false

    if (!user || !checkedPassword) {
      throw new AppError('E-mail e/ou senha inválidos', 401)
    }

    const { secret, expiresIn } = authConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn
    })

    return response.json({ user, token })
  }
}

module.exports = SessionsController
