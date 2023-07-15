import { DateTime } from 'luxon';
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';

export default class Room extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public hotelId: number | undefined;

  @column()
  public room_type: string | null;

  @column()
  public room_no: string;

  @column()
  public floor_no: string | null;

  @column()
  public price_type: string | null;

  @column()
  public purchase_price: string | null;

  @column()
  public sale_price: string | null;

  @column()
  public is_active: boolean;

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
