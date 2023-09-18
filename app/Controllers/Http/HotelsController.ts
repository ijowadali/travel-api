import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Hotel from 'App/Models/hotels/Hotel';

export default class hotelsController extends BaseController {
  public MODEL: typeof Hotel;
  constructor() {
    super();
    this.MODEL = Hotel;
  }

  // find all users  list
  public async findAllRecords({ auth, request, response }) {
    const user = auth.user!;
    let DQ = this.MODEL.query().whereNot('id', user.id);

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    // name filter
    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%');
    }
    // city filter
    if (request.input('city')) {
      DQ = DQ.whereILike('city', request.input('city') + '%');
    }

    if (!this.isSuperAdmin(user)) {
      DQ = DQ.where('company_id', user.companyId!);
    }

    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Hotels Not Found',
      });
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Users find Successfully',
        result: await DQ.paginate(page, pageSize),
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Users find Successfully',
        result: await DQ.select('*'),
      });
    }
  }

  // find Menu using id
  public async findSingleRecord({ request, response }) {
    try {
      const DQ = await this.MODEL.query()
        .where('id', request.param('id'))
        .first();

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Hotel Not Found',
        });
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Menu find successfully',
        result: DQ,
      });
    } catch (e) {
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // // find hotel list
  // public async find({ auth, request, response }) {
  //   const user = auth.user!;
  //   let hotel = this.MODEL.query();
  //   // Conditionally apply the where clause based on the user_type
  //   if (user.user_type !== 'super admin') {
  //     hotel = hotel.where('company_id', user.company_id);
  //   }
  //   if (request.input('name')) {
  //     hotel = hotel.whereILike('name', request.input('name') + '%');
  //   }
  //   if (request.input('city')) {
  //     hotel = hotel.whereILike('city', request.input('city') + '%');
  //   }

  //   return response.ok({
  //     code: HttpCodes.SUCCESS,
  //     result: await hotel.paginate(
  //       request.input(Pagination.PAGE_KEY, Pagination.PAGE),
  //       request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
  //     ),
  //     message: 'Hotels find Successfully',
  //   });
  // }
  // find hotel using id
  // public async get({ request, response }) {
  //   try {
  //     const hotel = await this.MODEL.query()
  //       .where('id', request.param('id'))
  //       .first();

  //     return response.ok({
  //       code: HttpCodes.SUCCESS,
  //       message: 'Hotel find Successfully',
  //       result: hotel,
  //     });
  //   } catch (e) {
  //     return response.internalServerError({
  //       code: HttpCodes.SERVER_ERROR,
  //       message: e.toString(),
  //     });
  //   }
  // }

  // create new hotel
  public async create({ auth, request, response }) {
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
  public async update({ request, response }) {
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
  public async destroy({ request, response }) {
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
