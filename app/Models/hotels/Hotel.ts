import { DateTime } from 'luxon';
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import Room from 'App/Models/hotels/Room';

export default class Hotel extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public company_id: number | undefined;

  @column()
  public name: string;

  @column()
  public phone_number: string;

  @column()
  public owner: string | null;

  @column()
  public owner_phone: string | null;

  @column()
  public address: string | null;

  @column()
  public city: string | null;

  @column()
  public state: string | null;

  @column()
  public country: string | null;

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

  @hasMany(() => Room)
  public rooms: HasMany<typeof Room>;
}
