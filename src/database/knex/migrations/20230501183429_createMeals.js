exports.up = knex =>
  knex.schema.createTable('meals', table => {
    table.increments('id')
    table.text('category').notNullable()
    table.text('name').notNullable()
    table.text('image')
    table.text('description').notNullable()
    table.decimal('price', 10, 2).notNullable()
  })

exports.down = knex => knex.schema.dropTable('meals')
