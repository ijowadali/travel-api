import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'bookings';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id');
      table
        .integer('company_id')
        .unsigned()
        .nullable()
        .references('companies.id');
      table.integer('user_id').unsigned().nullable().references('users.id');
      table.string('customer_name').nullable();
      table.string('status').notNullable().defaultTo('draft');
      table.integer('group_no').nullable();
      table.string('group_name').nullable();
      table.string('category').nullable();
      table.dateTime('approval_date').nullable();
      table.dateTime('expected_departure').nullable();
      table.boolean('confirmed_ticket').defaultTo(0);
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
