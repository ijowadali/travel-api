import { DateTime } from 'luxon';
import {column, BaseModel} from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';

export default class Bed extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public roomId: number | undefined;

  @column()
  public name: string | null;

  @column()
  public status: boolean;


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
