import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Permission from 'App/Models/Acl/Permission';

export default class extends BaseSeeder {
  public async run() {
    await Permission.createMany([
      { menuId: 1, name: 'can view dashboard', type: 'public' },
      { menuId: 2, name: 'can view system setting', type: 'public' },
      { menuId: 2, name: 'can view users', type: 'public' },
      { menuId: 2, name: 'can view user create', type: 'public' },
      { menuId: 2, name: 'can view user update', type: 'public' },
      { menuId: 2, name: 'can view user delete', type: 'private' },
      { menuId: 2, name: 'can view user profile', type: 'public' },
      { menuId: 2, name: 'can view roles', type: 'public' },
      { menuId: 2, name: 'can view role create', type: 'public' },
      { menuId: 2, name: 'can view role update', type: 'public' },
      { menuId: 2, name: 'can view role delete', type: 'private' },
      { menuId: 2, name: 'can view permissions', type: 'public' },
      { menuId: 2, name: 'can view permission create', type: 'public' },
      { menuId: 2, name: 'can view permission update', type: 'public' },
      { menuId: 2, name: 'can view permission delete', type: 'private' },
      { menuId: 3, name: 'can view company', type: 'public' },
      { menuId: 3, name: 'can view company create', type: 'public' },
      { menuId: 3, name: 'can view company update', type: 'public' },
      { menuId: 3, name: 'can view company delete', type: 'private' },
      { menuId: 4, name: 'can view bookings', type: 'public' },
      { menuId: 4, name: 'can view booking create', type: 'public' },
      { menuId: 4, name: 'can view booking update', type: 'public' },
      { menuId: 4, name: 'can view booking delete', type: 'private' },
    ]);
  }
}
