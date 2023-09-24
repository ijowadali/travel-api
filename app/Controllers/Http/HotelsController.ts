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
    let DQ = this.MODEL.query();

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

  // create new hotel
  public async create({ auth, request, response }) {
    try {
      const DE = await this.MODEL.findBy('name', request.body().name);

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: 'Hotel already exists!',
        });
      }
      const DM = new this.MODEL();
      DM.companyId = auth.user?.company_id;
      DM.name = request.body().name;
      DM.phone_number = request.body().phone_number;
      DM.owner = request.body().owner;
      DM.owner_phone = request.body().owner_phone;
      DM.status = request.body().status;
      DM.address = request.body().address;
      DM.city = request.body().city;
      DM.state = request.body().state;
      DM.country = request.body().country;

      const DQ = await DM.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Hotel Created Successfully!',
        result: DQ,
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
      const DQ = await this.MODEL.findBy('id', request.param('id'));

      if (!DQ) {
        return response.notFound({
          code: HttpCodes.NOT_FOUND,
          message: 'Hotel does not exists!',
        });
      }
      const DE = await this.MODEL.query()
        .where('name', 'like', request.body().name)
        .whereNot('id', request.param('id'))
        .first();

      if (DE) {
        return response.conflict({
          code: HttpCodes.CONFLICTS,
          message: `hotel: ${request.body().name} already exist!`,
        });
      }

      DQ.name = request.body().name;
      DQ.phone_number = request.body().phone_number;
      DQ.owner = request.body().owner;
      DQ.owner_phone = request.body().owner_phone;
      DQ.status = request.body().status;
      DQ.address = request.body().address;
      DQ.city = request.body().city;
      DQ.state = request.body().state;
      DQ.country = request.body().country;

      await DQ.save();
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Hotel updated Successfully!',
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

  // delete hotel using id
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'Hotel not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'Hotel deleted successfully' },
    });
  }
}
