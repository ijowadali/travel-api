import Booking from 'App/Models/Booking';
import { BaseController } from 'App/Controllers/BaseController';
import { DateTime } from 'luxon';
import HttpCodes from 'App/Enums/HttpCodes';
import BookingMemberDetail from 'App/Models/BookingMemberDetail';
import { updateBedStatus } from 'App/Helpers/BookingHelpers';

export default class BookingController extends BaseController {
  public MODEL: typeof Booking;
  constructor() {
    super();
    this.MODEL = Booking;
  }

  public async findAllRecords({ auth, request, response }) {
    const user = auth.user!;
    let DQ = this.MODEL.query();

    const page = request.input('page');
    const pageSize = request.input('pageSize');

    // Conditionally apply the where clause based on the user_type
    if (!this.isSuperAdmin(user)) {
      if (this.isAgent(user)) {
        DQ = DQ.where('user_id', user.id);
      } else {
        DQ = DQ.where('company_id', user.company_id);
      }
    }

    if (pageSize) {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Bookings find Successfully!',
        result: await DQ.paginate(page, pageSize),
      });
    } else {
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Bookings find Successfully!',
        result: await DQ.select('*'),
      });
    }
  }

  public async findSingleRecord({ request, response }) {
    const DQ = await this.MODEL.query()
      .where('id', request.param('id'))
      .preload('companies')
      .preload('members', (details) => {
        details.preload('hotelDetails');
      })
      .first();

    if (!DQ) {
      return response.notFound({ message: 'booking not found' });
    }
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Booking Find Successfully',
      result: DQ,
    });
  }

  public async create({ auth, request, response }) {
    try {
      const data = request.body();
      const user = auth.user!;
      const res = await this.mapBooking(null, data, user);

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Operation Successfully',
        result: res,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      });
    }
  }

  public async update({ request, response }) {
    try {
      const data = request.body();
      await this.mapBooking(request.param('id'), data, null);
      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'Booking updated Successfully!',
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.message,
      });
    }
  }

  public async mapBooking(id = null, data, user) {
    let booking: any;
    if (id) {
      booking = await this.MODEL.query().where('id', id).first();
      if (!booking) {
        return false;
      }
    } else {
      booking = new this.MODEL();
      if (user && !this.isSuperAdmin(user)) {
        booking.user_id = user.id;
        booking.companyId = user.company_id;
      }
    }

    if (data.type === 'general' || !id) {
      booking.customer_name = data.customer_name;
      booking.status = data.status;
      booking.group_no = data.group_no;
      booking.group_name = data.group_name;
      booking.category = data.category;
      booking.approval_date = DateTime.fromJSDate(new Date(data.approval_date));
      booking.expected_departure = DateTime.fromJSDate(
        new Date(data.expected_departure)
      );
      booking.confirmed_ticket = data.confirmed_ticket;
      await booking.save();
    } else if (data.type === 'member') {
      if (data.dob instanceof Date) {
        data.dob = DateTime.fromJSDate(new Date(data.dob));
      } else if (typeof data.dob === 'number') {
        data.dob = DateTime.fromJSDate(new Date(data.dob));
      }
      if (data.issue_date instanceof Date) {
        data.issue_date = DateTime.fromJSDate(new Date(data.issue_date));
      } else if (typeof data.issue_date === 'number') {
        data.issue_date = DateTime.fromJSDate(new Date(data.issue_date));
      }
      if (data.expiry_date instanceof Date) {
        data.expiry_date = DateTime.fromJSDate(new Date(data.expiry_date));
      } else if (typeof data.expiry_date === 'number') {
        data.expiry_date = DateTime.fromJSDate(new Date(data.expiry_date));
      }
      if (id) {
        const member = data;
        delete member.type;
        if (member.id) {
          await booking.related('members').updateOrCreate({}, member);
        } else {
          await booking.related('members').create(member);
        }
      }
    } else if (data.type === 'hotel') {
      delete data.type;
      const member = await BookingMemberDetail.query().where('id', id).first();
      if (member) {
        if (data.id) {
          await member.related('hotelDetails').updateOrCreate({}, data);
          if (data.bed_id) {
            await updateBedStatus(data.bed_id, 'booked');
          }
        } else {
          await member.related('hotelDetails').create(data);
        }
      }
    }
    return booking;
  }

  // delete single user using id
  public async destroy({ request, response }) {
    const DQ = await this.MODEL.findBy('id', request.param('id'));
    if (!DQ) {
      return response.notFound({
        status: HttpCodes.NOT_FOUND,
        message: 'Booking not found',
      });
    }
    await DQ.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Booking deleted successfully.',
    });
  }
}
