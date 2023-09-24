import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BedsController from 'App/Controllers/Http/BedsController';

Route.group(async () => {
  Route.get('/', (ctx: HttpContextContract) => {
    return new BedsController().findAllRecords(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/beds');
