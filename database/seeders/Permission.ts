import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
// import { permissions } from '../data/permissions';
import Permission from 'App/Models/Acl/Permission';

export default class extends BaseSeeder {
  public async run() {
    await Permission.createMany([
      { name: 'can view dashboard menu' },
      { name: 'can view system setting menu' },
      { name: 'can view users' },
      { name: 'can view roles' },
      { name: 'can view permissions' },
      { name: 'can view company menu' },
      { name: 'can view bookings menu' },
      { name: 'can view bookings' },
      { name: 'can view add booking' },
    ]);
  }
}
