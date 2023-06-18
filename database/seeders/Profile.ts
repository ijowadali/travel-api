import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Profile from 'App/Models/Profile';

export default class extends BaseSeeder {
  public async run() {
    await Profile.createMany([
      {
        userId: 1,
        first_name: 'Iqbal',
        last_name: 'Hassan',
        phone_number: '12345678',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
        profile_picture: null,
      },
    ]);
  }
}
