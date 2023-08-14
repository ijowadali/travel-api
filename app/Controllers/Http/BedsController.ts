import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
import Bed from 'App/Models/hotels/Bed';

export default class BedsController extends BaseController {
  public MODEL: typeof Bed;
  constructor() {
    super();
    this.MODEL = Bed;
  }
  // find room list
  public async find({ request, response }: HttpContextContract) {
    let beds = this.MODEL.query();
    if (request.input('name')){
      beds = beds.whereILike('name', request.input('name')+'%');
    }
    if (request.input('room_id')){
      beds = beds.where('room_id', request.input('room_id'));
    }
    if (request.input('status')){
      beds = beds.where('status', request.input('status'));
    }
    if (request.input('hotel_id')){
      beds = beds.where('hotel_id', request.input('hotel_id'));
    }
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: await beds
        .paginate(
          request.input(Pagination.PAGE_KEY, Pagination.PAGE),
          request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
        ),
      message: 'Beds find Successfully',
    });
  }
}
