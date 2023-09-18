import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import HotelsController from 'App/Controllers/Http/HotelsController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new HotelsController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new HotelsController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new HotelsController().destroy(ctx);
  });
  Route.get('/', (ctx: HttpContextContract) => {
    return new HotelsController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new HotelsController().findSingleRecord(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/hotels');
