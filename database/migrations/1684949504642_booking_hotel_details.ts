import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'booking_hotel_details'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('booking_id').unsigned().references('bookings.id');
      table.string('room_type').nullable();
      table.string('package').nullable();
//            $table->boolean('short_booking')->default(0);
      table.integer('hotel1_id').unsigned().nullable();
      table.string('hotel1_name').nullable();
      table.integer('night1').nullable();
      table.integer('hotel2_id').unsigned().nullable();
      table.string('hotel2_name').nullable();
      table.integer('night2').nullable();
      table.integer('hotel3_id').nullable();
      table.string('hotel3_name').nullable();
      table.integer('night3').nullable();
      table.boolean('short_booking').defaultTo(false);
      table.integer('adults').nullable();
      table.integer('children').nullable();
      table.integer('infants').nullable();

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
