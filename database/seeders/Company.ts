import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Company from 'App/Models/Company';

export default class extends BaseSeeder {
  public async run() {
    await Company.createMany([
      {
        userId: 1,
        company_name: 'owner shop',
        phone: '123456789',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        logo: null,
      },
      {
        userId: 2,
        company_name: 'admin shop',
        phone: '123456789',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        logo: null,
      },
      {
        userId: 3,
        company_name: 'vendor shop',
        phone: '123456789',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        logo: null,
      },
    ]);
  }
}
