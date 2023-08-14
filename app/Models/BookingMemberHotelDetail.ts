import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import {STANDARD_DATE_TIME_FORMAT} from "App/Helpers/utils";
import Hotel from "App/Models/hotels/Hotel";
import Room from "App/Models/hotels/Room";
import Bed from "App/Models/hotels/Bed";

export default class BookingMemberHotelDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  // @column()
  // public bookingId: number

  @column()
  public bookingMemberDetailId: number

  @column()
  public hotelId: number

  @column()
  public roomId: number

  @column()
  public bedId: number

  @column()
  public city: string | null

  @column()
  public roomType: string | null

  @column()
  public package: string | null

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

  @belongsTo(() => Hotel)
  public hotel: BelongsTo<typeof Hotel>;

  @belongsTo(() => Room)
  public room: BelongsTo<typeof Room>;

  @belongsTo(() => Bed)
  public bed: BelongsTo<typeof Bed>;
}
