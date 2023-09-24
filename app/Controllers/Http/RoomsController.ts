import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Room from 'App/Models/hotels/Room';

export default class roomsController extends BaseController {
  public MODEL: typeof Room;
  constructor() {
    super();
    this.MODEL = Room;
  }
  // find room list
  public async findAllRecords({ request, response }) {
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    if (request.input('name')) {
      DQ = DQ.whereILike('room_no', request.input('name') + '%');
    }
    if (request.input('hotel_id')) {
      DQ = DQ.where('hotel_id', request.input('hotel_id'));
    }
    if (request.input('is_active')) {
      DQ = DQ.where('is_active', request.input('is_active'));
    }
    if (request.input('room_type')) {
      DQ = DQ.whereILike('room_type', request.input('room_type') + '%');
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Rooms find Successfully',
        result: await DQ.preload('hotels').paginate(page, pageSize),
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Room find Successfully',
        result: await DQ.preload('hotels'),
      });
    }
  }

  // find room using id
  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('hotels')
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Room find Successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // create new room
  public async create({ request, response }) {
    try {
      const DE = await this.MODEL.query()
        .where('room_no', request.body().room_no)
        .where('hotel_id', request.body().hotel_id)
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Room already exists!',
        });
      }

      const DM = new this.MODEL();
      DM.hotelId = request.body().hotel_id;
      DM.room_type = request.body().room_type;
      DM.room_no = request.body().room_no;
      DM.floor_no = request.body().floor_no;
      DM.price_type = request.body().price_type;
      DM.purchase_price = request.body().purchase_price;
      DM.sale_price = request.body().sale_price;
      DM.no_of_bed = request.body().no_of_bed;
      DM.is_active = request.body().is_active;

      await DM.save();
      for (let i = 1; i <= request.body().no_of_bed; i++) {
        await DM.related('beds').create({
          name:
            request.body().floor_no +
            '-' +
            request.body().room_no +
            '-' +
            'B' +
            i,
        });
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Room Created Successfully!',
        result: DM,
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
  public async update({ request, response }) {
    try {
      const DQ = await this.MODEL.findBy('id', request.param('id'));

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Room does not exists!',
        });
      }

      const DE = await this.MODEL.query()
        .where('room_no', 'like', request.body().room_no)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `Room: ${request.body().room_no} already exist!`,
        });
      }

      DQ.room_type = request.body().room_type;
      DQ.room_no = request.body().room_no;
      DQ.floor_no = request.body().floor_no;
      DQ.price_type = request.body().price_type;
      DQ.purchase_price = request.body().purchase_price;
      DQ.sale_price = request.body().sale_price;
      DQ.is_active = request.body().is_active;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Room updated Successfully!',
        result: DQ,
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
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Room not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Room deleted successfully' },
    });
  }
}
