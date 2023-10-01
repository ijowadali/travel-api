import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'booking_hotel_details'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('booking_id').unsigned().references('bookings.id').onDelete('CASCADE').onUpdate('CASCADE');
      table.integer('hotel_id').unsigned().references('hotels.id').onDelete('CASCADE').onUpdate('CASCADE');
      table.string('city').nullable();
      table.string('room_type').nullable();
      table.integer('nights').nullable();
      table.dateTime('check_in_date').nullable();
      table.dateTime('check_out_date').nullable();
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
