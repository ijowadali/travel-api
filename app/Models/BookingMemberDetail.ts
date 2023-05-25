import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import {STANDARD_DATE_TIME_FORMAT} from "App/Helpers/utils";

export default class BookingMemberDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bookingId: number

  @column()
  public firstName: string

  @column()
  public familyName: string

  @column()
  public gender: string

  @column()
  public familyHead: boolean

  @column()
  public dob: Date

  @column()
  public maritalStatus: string

  @column()
  public title: string

  @column()
  public education: string

  @column()
  public nationality: string

  @column()
  public passport: string

  @column()
  public passportType: string

  @column()
  public issueDate: Date

  @column()
  public expiryDate: Date

  @column()
  public relation: string

  @column()
  public mehramName: string

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
