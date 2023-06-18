import { DateTime } from 'luxon';
import Hash from '@ioc:Adonis/Core/Hash';
import {
  column,
  beforeSave,
  BaseModel,
  ManyToMany,
  manyToMany,
  hasOne,
  HasOne,
  beforeFind,
  afterFetch,
  ModelQueryBuilderContract,
} from '@ioc:Adonis/Lucid/Orm';
import Permission from 'App/Models/Acl/Permission';
import Role from 'App/Models/Acl/Role';
import Profile from 'App/Models/Profile';
import Company from 'App/Models/Company';
import { STANDARD_DATE_TIME_FORMAT } from 'App/Helpers/utils';

type UserQuery = ModelQueryBuilderContract<typeof User>;
type RoleQuery = ModelQueryBuilderContract<typeof Role>;

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public company_id: number;

  @column()
  public email: string;

  @column()
  public user_type: string;

  @column({ serializeAs: null })
  public password: string;

  @column()
  public isPhoneVerified: boolean;

  @column()
  public isEmailVerified: boolean;

  @column()
  public rememberMeToken: string | null;

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

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  // Relations
  @manyToMany(() => Role, {
    pivotTable: 'user_has_roles',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
  })
  public roles: ManyToMany<typeof Role>;

  @manyToMany(() => Permission, {
    pivotTable: 'user_has_permissions',
    localKey: 'id',
    pivotForeignKey: 'user_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'permission_id',
  })
  public permissions: ManyToMany<typeof Permission>;

  @hasOne(() => Profile)
  public profile: HasOne<typeof Profile>;

  @hasOne(() => Company)
  public company: HasOne<typeof Company>;

  //Hooks
  @beforeFind()
  public static preloadListUserRoles(query: UserQuery) {
    query
      .preload('permissions')
      .preload('roles', (rolesQuery: RoleQuery) => {
        rolesQuery.preload('permissions');
      })
      .preload('profile')
      .preload('company');
  }

  // delete password for fetched user
  @afterFetch()
  public static deletePasswordList(users: User[]) {
    users.forEach((user) => {
      delete user.$attributes.password;
    });
  }
}
