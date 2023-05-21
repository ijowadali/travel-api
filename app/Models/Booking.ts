import { DateTime } from 'luxon';
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public company_id: number;

  @column()
  public booking_number: string;

  @column()
  public customer_name: string | null;

  @column()
  public booking_status: string | null;

  @column()
  public group_no: number | null;

  @column()
  public group_name: string | null;

  @column()
  public category: string | null;

  @column.dateTime({
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  @column()
  public approval_date: DateTime | null;

  @column()
  public expected_departure: DateTime | null;
  @column()
  public confirmed_ticket: boolean;

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public createdAt: DateTime;

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public updatedAt: DateTime;
}
