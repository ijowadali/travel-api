import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Hotel from 'App/Models/hotels/Hotel';

export default class extends BaseSeeder {
  public async run() {
    await Hotel.createMany([
      {
        companyId: 1,
        name: 'comapny1hotel1',
        phone_number: '123456789',
        owner: 'Jawad',
        owner_phone: '123456789',
        address: 'DHA Phase 5',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
      {
        companyId: 1,
        name: 'comapny1hotel2',
        phone_number: '123456789',
        owner: 'Jawad',
        owner_phone: '123456789',
        address: '22/M',
        city: 'Lodhran',
        state: 'Punjab',
        country: 'Pakistan',
      },
      {
        companyId: 2,
        name: 'comapny2hotel1',
        phone_number: '123456789',
        owner: 'Ali',
        owner_phone: '123456789',
        address: 'kalma chock',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
      {
        companyId: 3,
        name: 'comapny3hotel1',
        phone_number: '123456789',
        owner: 'Ahmed',
        owner_phone: '123456789',
        address: 'Johar Town',
        city: 'Lahore',
        state: 'Punjab',
        country: 'Pakistan',
      },
    ]);
  }
}
