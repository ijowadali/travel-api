import { DateTime } from 'luxon';
import {column, BaseModel, hasOne, HasOne, hasMany, HasMany} from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import BookingVisaDetail from "App/Models/BookingVisaDetail";
import BookingHotelDetail from "App/Models/BookingHotelDetail";
import BookingMemberDetail from "App/Models/BookingMemberDetail";

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
  public approval_date: DateTime | null;

  @column.dateTime({
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

  @hasOne(() => BookingVisaDetail)
  public bookingVisaDetails: HasOne<typeof BookingVisaDetail>;

  @hasOne(()=> BookingHotelDetail)
  public bookingHotelDetails: HasOne<typeof BookingHotelDetail>

  @hasMany(()=>BookingMemberDetail)
  public bookingMemberDetails: HasMany<typeof BookingMemberDetail>
}
