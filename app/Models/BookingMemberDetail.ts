import { DateTime } from 'luxon'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'
import {DATE_FORMAT, STANDARD_DATE_TIME_FORMAT} from "App/Helpers/utils";
import BookingMemberHotelDetail from "App/Models/BookingMemberHotelDetail";

export default class BookingMemberDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bookingId: number

  @column()
  public name: string

  @column()
  public gender: string

  @column()
  public familyHead: boolean

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(DATE_FORMAT) : '';
    },
  })
  public dob: DateTime

  @column()
  public maritalStatus: string

  @column()
  public passport: string

  @column()
  public passportType: string

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(DATE_FORMAT) : '';
    },
  })
  public issue_date: DateTime

  @column.dateTime({
    // autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(DATE_FORMAT) : '';
    },
  })
  public expiry_date: DateTime

  @column()
  public iata: string

  @column()
  public visa_company: string

  @column()
  public visa_status: string

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

  @hasMany(() => BookingMemberHotelDetail)
  public hotelDetails: HasMany<typeof BookingMemberHotelDetail>;
}
