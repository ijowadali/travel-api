import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import {STANDARD_DATE_TIME_FORMAT} from "App/Helpers/utils";

export default class BookingHotelDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bookingId: number

  @column()
  public roomType: string | null

  @column()
  public package: string | null

  @column()
  public hotel1_id: number | null

  @column()
  public hotel1_name: string | null

  @column()
  public night1: number | null

  @column()
  public hotel2_id: number| null

  @column()
  public hotel2_name: string | null

  @column()
  public night2: string|null

  @column()
  public hotel3_id: number | null

  @column()
  public hotel3_name: string|null

  @column()
  public night3: number|null

  @column()
  public shortBooking: boolean

  @column()
  public adults: number|null

  @column()
  public children: number|null

  @column()
  public infants: number|null

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
}
