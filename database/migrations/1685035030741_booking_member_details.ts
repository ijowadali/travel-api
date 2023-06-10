import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'booking_member_details'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('booking_id').unsigned().references('bookings.id');
      table.string('first_name');
      table.string('family_name');
      table.string('gender');
      table.boolean('family_head').defaultTo(0);
      table.date('dob').nullable();
      table.string('marital_status');
      table.string('title').nullable();
      table.string('education');
      table.string('nationality');
      table.string('passport');
      table.string('passport_type');
      table.date('issue_date');
      table.date('expiry_date');
      table.string('relation');
      table.string('mehram_name');
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
