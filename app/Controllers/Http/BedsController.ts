import { BaseController } from 'App/Controllers/BaseController';
import HttpCodes from 'App/Enums/HttpCodes';
import Bed from 'App/Models/hotels/Bed';

export default class BedsController extends BaseController {
  public MODEL: typeof Bed;
  constructor() {
    super();
    this.MODEL = Bed;
  }
  // find beds list
  public async findAllRecords({ request, response }) {
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    if (request.input('name')) {
      DQ = DQ.whereILike('name', request.input('name') + '%');
    }
    if (request.input('room_id')) {
      DQ = DQ.where('room_id', request.input('room_id'));
    }
    if (request.input('status')) {
      DQ = DQ.where('status', request.input('status'));
    }
    if (request.input('hotel_id')) {
      DQ = DQ.where('hotel_id', request.input('hotel_id'));
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Beds find Successfully',
        result: await DQ.paginate(page, pageSize),
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Beds find Successfully',
        result: await DQ.select('*'),
      });
    }
  }
}
