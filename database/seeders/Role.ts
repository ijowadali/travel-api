import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Role from 'App/Models/Acl/Role';

export default class extends BaseSeeder {
  public async run() {
    await Role.createMany([
      {
        name: 'super admin',
      },
      {
        name: 'admin',
      },
      {
        name: 'company admin',
      },
      {
        name: 'admin',
        companyId: 1,
      },
      {
        name: 'manager',
        companyId: 1,
      },
      {
        name: 'admin',
        companyId: 2,
      },
      {
        name: 'manager',
        companyId: 2,
      },
      {
        name: 'admin',
        companyId: 3,
      },
      {
        name: 'manager',
        companyId: 3,
      },
    ]);
  }
}
