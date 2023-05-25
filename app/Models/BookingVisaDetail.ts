import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import {STANDARD_DATE_TIME_FORMAT} from "App/Helpers/utils";

export default class BookingVisaDetail extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public bookingId: number

  @column()
  public iata: string | null

  @column()
  public visaCompany: string | null

  @column()
  public visaStatus: string | null

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
