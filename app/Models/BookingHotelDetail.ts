import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import {STANDARD_DATE_TIME_FORMAT} from "App/Helpers/utils";
import Booking from "App/Models/Booking";

export default class BookingHotelDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bookingId: number

  @column()
  public hotelId: number

  @column()
  public city: string | null

  @column()
  public roomType: string | null

  @column()
  public nights: number | null

  @column.dateTime({
    serialize(value) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public checkIn_date: DateTime | null;

  @column.dateTime({
    serialize(value) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public checkOut_date: DateTime | null;

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public updatedAt: DateTime

  @belongsTo(() => Booking)
  public booking: BelongsTo<typeof Booking>;

}
