import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'iqbal@gmail.com',
        password: '123456',
        user_type: 'super admin',
      },
    ]);
  }
}
