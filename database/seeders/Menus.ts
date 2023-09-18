import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Menu from 'App/Models/Menu';

export default class extends BaseSeeder {
  public async run() {
    await Menu.createMany([
      {
        menu_name: 'Dashboard',
      },
      {
        menu_name: 'System Setting',
      },
      {
        menu_name: 'Companies',
      },
      {
        menu_name: 'Bookings',
      },
    ]);
  }
}
