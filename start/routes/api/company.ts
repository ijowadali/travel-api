import Route from '@ioc:Adonis/Core/Route';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import CompanyController from 'App/Controllers/Http/CompanyController';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new CompanyController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new CompanyController().create(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new CompanyController().delete(ctx);
  });

  Route.get('/', (ctx: HttpContextContract) => {
    return new CompanyController().index(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new CompanyController().show(ctx);
  });
})
  .middleware(['auth:api'])
  .prefix('/api/v1/company');
