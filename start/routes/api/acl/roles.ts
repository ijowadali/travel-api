import Route from '@ioc:Adonis/Core/Route';
import RolesController from 'App/Controllers/Http/Acl/RolesController';
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';

Route.group(async () => {
  Route.post('/', (ctx: HttpContextContract) => {
    return new RolesController().create(ctx);
  });
  Route.put('/:id', (ctx: HttpContextContract) => {
    return new RolesController().update(ctx);
  });
  Route.delete('/:id', (ctx: HttpContextContract) => {
    return new RolesController().destroy(ctx);
  });
  Route.put('/assign-permission/:id', (ctx: HttpContextContract) => {
    return new RolesController().assignPermission(ctx);
  });
  Route.get('/', (ctx: HttpContextContract) => {
    return new RolesController().findAllRecords(ctx);
  });
  Route.get('/:id', (ctx: HttpContextContract) => {
    return new RolesController().findSingleRecord(ctx);
  });
}).prefix('/api/v1/roles');
