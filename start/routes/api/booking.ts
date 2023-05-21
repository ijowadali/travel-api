import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import BookingController from 'App/Controllers/Http/BookingController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new BookingController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new BookingController().create(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new BookingController().delete(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new BookingController().index(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new BookingController().show(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/bookings');
