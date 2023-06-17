import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import RoomsController from 'App/Controllers/Http/RoomsController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new RoomsController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new RoomsController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new RoomsController().destroy(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new RoomsController().find(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new RoomsController().get(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/rooms');
