import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
import Room from 'App/Models/hotels/Room';

export default class roomsController extends BaseController {
  public MODEL: typeof Room;
  constructor() {
    super();
    this.MODEL = Room;
  }
  // find room list
  public async find({ request, response }: HttpContextContract) {
    let room = this.MODEL.query();

    return response.ok({
      code: HttpCodes.SUCCESS,
      result: await room
        .preload('hotels')
        .paginate(
          request.input(Pagination.PAGE_KEY, Pagination.PAGE),
          request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
        ),
      message: 'Rooms find Successfully',
    });
  }
  // find room using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const room = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('hotels')
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Room find Successfully',
        result: room,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  // create new room
  public async create({ request, response }: HttpContextContract) {
    try {
      const exist = await this.MODEL.query()
        .where('room_no', request.body().room_no)
        .where('hotel_id', request.body().hotel_id)
        .first();

      if (exist) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Room already exists!',
        });
      }
      const room = new this.MODEL();
      room.hotelId = request.body().hotel_id;
      room.room_type = request.body().room_type;
      room.room_no = request.body().room_no;
      room.floor_no = request.body().floor_no;
      room.price_type = request.body().price_type;
      room.purchase_price = request.body().purchase_price;
      room.sale_price = request.body().sale_price;
      room.is_active = request.body().is_active;

      await room.save();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Room Created Successfully!',
        result: room,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // update room using id
  public async update({ request, response }: HttpContextContract) {
    try {
      const room = await this.MODEL.findBy('id', request.param('id'));
      if (!room) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Room does not exists!',
        });
      }
      const exist = await this.MODEL.query()
        .where('room_no', 'like', request.body().room_no)
        .whereNot('id', request.param('id'))
        .first();

      if (exist) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Room: ${request.body().room_no} already exist!`,
        });
      }
      room.room_type = request.body().room_type;
      room.room_no = request.body().room_no;
      room.floor_no = request.body().floor_no;
      room.price_type = request.body().price_type;
      room.purchase_price = request.body().purchase_price;
      room.sale_price = request.body().sale_price;
      room.is_active = request.body().is_active;

      await room.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Room updated Successfully!',
        result: room,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      });
    }
  }

  // delete room using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Room not found',
      });
    }
    await data.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Room deleted successfully' },
    });
  }
}
