
exports.up = function (knex, Promise) {
  knex.schema.createTable('users', table => {
    table.increments();
    table.string('name', 100).notNullable();
    table.string('email').unique().notNullable();
    table.string('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
    return knex.schema.createTable('gallery', table => {
      table.increments();
      table.string('author', 100).notNullable();
      table.string('link').notNullable();
      table.text('description').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
};

exports.down = function (knex, Promise) {
   knex.schema.dropTable('users');
   return knex.schema.dropTable('photos');
};
