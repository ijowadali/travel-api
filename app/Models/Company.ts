import { DateTime } from 'luxon';
import { column, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import Hotel from 'App/Models//hotels/Hotel';

export default class Company extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  // @column()
  // public userId: number;

  @column()
  public company_name: string;

  @column()
  public phone: string | null;

  @column()
  public address: string | null;

  @column()
  public city: string | null;

  @column()
  public zipcode: string | null;

  @column()
  public state: string | null;

  @column()
  public country: string | null;

  @column()
  public logo: string | null;

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

  @hasMany(() => Hotel)
  public hotels: HasMany<typeof Hotel>;
}
