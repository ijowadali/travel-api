import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'beds'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('room_id')
        .unsigned()
        .references('rooms.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('name');
      table.boolean('status').defaultTo(false);

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
