import { DateTime } from 'luxon';
import {
  column,
  BaseModel,
  hasMany,
  HasMany,
  belongsTo,
  BelongsTo,
} from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import Member from 'App/Models/BookingMemberDetail';
import Company from 'App/Models/Company';

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public companyId: number;

  @column()
  public user_id: number;

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
    // autoCreate: true,
    serialize(value) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
  public approval_date: DateTime | null;

  @column.dateTime({
    autoCreate: true,
    serialize(value: DateTime) {
      return value ? value.toFormat(STANDARD_DATE_TIME_FORMAT) : '';
    },
  })
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

  @hasMany(() => Member)
  public members: HasMany<typeof Member>;

  // @hasMany(() => BookingMemberHotelDetail)
  // public hotelDetails: HasMany<typeof BookingMemberHotelDetail>;

  @belongsTo(() => Company)
  public companies: BelongsTo<typeof Company>;
}
