import { DateTime } from 'luxon';
import {
  column,
  BaseModel,
  manyToMany,
  ManyToMany,
  BelongsTo,
  belongsTo,
} from '@ioc:Adonis/Lucid/Orm';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';
import User from 'App/Models/User';
import Permission from 'App/Models/Acl/Permission';
import Company from 'App/Models/Company';

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  companyId: number | undefined;

  @column()
  public name: string;

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

  @manyToMany(() => User, {
    pivotTable: 'user_has_roles',
    pivotTimestamps: true,
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  public users: ManyToMany<typeof User>;

  @manyToMany(() => Permission, {
    pivotTable: 'role_has_permissions',
    pivotTimestamps: true,
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'permission_id',
  })
  public permissions: ManyToMany<typeof Permission>;

  @belongsTo(() => Company)
  public company: BelongsTo<typeof Company>;
}
