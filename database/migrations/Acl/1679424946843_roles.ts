import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'roles';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table.string('name').notNullable();
      table
        .integer('company_id')
        .unsigned()
        .nullable()
        .references('companies.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');

      table.unique(['company_id', 'name']);

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now());
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now());
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
