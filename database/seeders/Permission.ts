import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import Permission from 'App/Models/Acl/Permission';

export default class extends BaseSeeder {
  public async run() {
    await Permission.createMany([
      { menuId: 1, name: 'can view dashboard menu', type: 'public' },
      { menuId: 2, name: 'can view system setting menu', type: 'public' },
      { menuId: 2, name: 'can view users menu', type: 'public' },
      { menuId: 2, name: 'can view user create', type: 'public' },
      { menuId: 2, name: 'can view user update', type: 'public' },
      { menuId: 2, name: 'can view user delete', type: 'private' },
      { menuId: 2, name: 'can view user profile', type: 'public' },
      { menuId: 2, name: 'can view roles menu', type: 'public' },
      { menuId: 2, name: 'can view role create', type: 'public' },
      { menuId: 2, name: 'can view role update', type: 'public' },
      { menuId: 2, name: 'can view role delete', type: 'private' },
      { menuId: 2, name: 'can view permissions menu', type: 'private' },
      { menuId: 2, name: 'can view permission create', type: 'private' },
      { menuId: 2, name: 'can view permission update', type: 'private' },
      { menuId: 2, name: 'can view menus menu', type: 'private' },
      { menuId: 2, name: 'can view menu create', type: 'private' },
      { menuId: 2, name: 'can view menu update', type: 'private' },
      { menuId: 2, name: 'can view menu delete', type: 'private' },
      { menuId: 3, name: 'can view company menu', type: 'private' },
      { menuId: 3, name: 'can view company create', type: 'private' },
      { menuId: 3, name: 'can view company update', type: 'private' },
      { menuId: 3, name: 'can view company delete', type: 'private' },
      { menuId: 4, name: 'can view bookings menu', type: 'public' },
      { menuId: 4, name: 'can view bookings list', type: 'public' },
      { menuId: 4, name: 'can view booking create', type: 'public' },
      { menuId: 4, name: 'can view booking update', type: 'public' },
      { menuId: 4, name: 'can view booking delete', type: 'private' },
      { menuId: 5, name: 'can view hotels menu', type: 'public' },
      { menuId: 5, name: 'can view hotels list', type: 'public' },
      { menuId: 5, name: 'can view hotel create', type: 'public' },
      { menuId: 5, name: 'can view hotel update', type: 'public' },
      { menuId: 5, name: 'can view hotel delete', type: 'public' },
      { menuId: 5, name: 'can view rooms menu', type: 'public' },
      { menuId: 5, name: 'can view room create', type: 'public' },
      { menuId: 5, name: 'can view room update', type: 'public' },
      { menuId: 5, name: 'can view room delete', type: 'public' },
    ]);
  }
}
