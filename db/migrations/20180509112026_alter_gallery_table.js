
exports.up = function (knex, Promise) {
  return knex.schema.table('gallery', table => {
    table.integer('author_id').unsigned().notNullable().references('id').inTable('users');
  })
};

exports.down = function (knex, Promise) {
  return knex.schema.table('gallery', table => {
    table.dropColumn('author_id');
  })
};
