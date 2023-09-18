import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';
import User from 'App/Models/User';

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        companyId: undefined,
        email: 'iqbal@gmail.com',
        password: '123456',
      },
      {
        companyId: undefined,
        email: 'admin@gmail.com',
        password: '123456',
      },
      {
        companyId: 1,
        email: 'shop1user1@gmail.com',
        password: '123456',
      },
      {
        companyId: 1,
        email: 'shop1user2@gmail.com',
        password: '123456',
      },
      {
        companyId: 2,
        email: 'shop2user1@gmail.com',
        password: '123456',
      },
      {
        companyId: 2,
        email: 'shop2user2@gmail.com',
        password: '123456',
      },
      {
        companyId: 3,
        email: 'shop3user1@gmail.com',
        password: '123456',
      },
      {
        companyId: 3,
        email: 'shop3user2@gmail.com',
        password: '123456',
      },
    ]);
  }
}
