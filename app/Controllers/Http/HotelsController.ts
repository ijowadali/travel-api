import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Pagination from 'App/Enums/Pagination';
import Hotel from 'App/Models/hotels/Hotel';

export default class hotelsController extends BaseController {
  public MODEL: typeof Hotel;
  constructor() {
    super();
    this.MODEL = Hotel;
  }
  // find hotel list
  public async find({ auth, request, response }: HttpContextContract) {
    const user = auth.user!;
    let hotel = this.MODEL.query();
    // Conditionally apply the where clause based on the user_type
    if (user.user_type !== 'super admin') {
      hotel = hotel.where('company_id', user.company_id);
    }

    return response.ok({
      code: HttpCodes.SUCCESS,
      result: await hotel.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
      message: 'Hotels find Successfully',
    });
  }
  // find hotel using id
  public async get({ request, response }: HttpContextContract) {
    try {
      const hotel = await this.MODEL.query()
        .where('id', request.param('id'))
        .preload('rooms')
        .first();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Hotel find Successfully',
        result: hotel,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  // create new hotel
  public async create({ auth, request, response }: HttpContextContract) {
    try {
      const exists = await this.MODEL.findBy('name', request.body().name);

      if (exists) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Hotel already exists!',
        });
      }
      const hotel = new this.MODEL();
      hotel.company_id = auth.user?.company_id;
      hotel.name = request.body().name;
      hotel.phone_number = request.body().phone_number;
      hotel.owner = request.body().owner;
      hotel.owner_phone = request.body().owner_phone;
      hotel.address = request.body().address;
      hotel.city = request.body().city;
      hotel.state = request.body().state;
      hotel.country = request.body().country;
      await hotel.save();

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Hotel Created Successfully!',
        result: hotel,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // update hotel using id
  public async update({ request, response }: HttpContextContract) {
    try {
      const hotel = await this.MODEL.findBy('id', request.param('id'));
      if (!hotel) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Hotel does not exists!',
        });
      }
      const exist = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();
      if (exist) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `hotel: ${request.body().name} already exist!`,
        });
      }
      hotel.name = request.body().name;
      hotel.phone_number = request.body().phone_number;
      hotel.owner = request.body().owner;
      hotel.owner_phone = request.body().owner_phone;
      hotel.address = request.body().address;
      hotel.city = request.body().city;
      hotel.state = request.body().state;
      hotel.country = request.body().country;

      await hotel.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Hotel updated Successfully!',
        result: hotel,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      });
    }
  }

  // delete hotel using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Hotel not found',
      });
    }
    await data.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Hotel deleted successfully' },
    });
  }
}
