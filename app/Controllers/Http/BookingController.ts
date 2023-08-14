import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Booking from 'App/Models/Booking';
import Pagination from 'App/Enums/Pagination';
import { BaseController } from 'App/Controllers/BaseController';
import { DateTime } from 'luxon';
import HttpCodes from 'App/Enums/HttpCodes';
import BookingMemberDetail from "App/Models/BookingMemberDetail";
import {updateBedStatus} from "App/Helpers/BookingHelpers";

export default class BookingController extends BaseController {
  public MODEL: typeof Booking;
  constructor() {
    super();
    this.MODEL = Booking;
  }
  public async index({ auth, request, response }: HttpContextContract) {
    const user = auth.user!;
    let bookingQuery = this.MODEL.query();

    // Conditionally apply the where clause based on the user_type
    if (user.user_type !== 'super admin') {
      if (user.user_type === 'agent') {
        bookingQuery = bookingQuery.where('user_id', user.id);
      } else {
        bookingQuery = bookingQuery.where('company_id', user.companyId);
      }
    }

    return response.send({
      code: 200,
      message: 'Bookings find Successfully!',
      result: await bookingQuery.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
    });
  }

  public async create({ auth, request, response }: HttpContextContract) {
    const data = request.body();
    const user = auth.user!;
    await this.mapBooking(null, data, user);
    return response.ok({
      message: 'Operation Successfully',
    });
  }

  public async update({ request, response }: HttpContextContract) {
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
    let booking;
    if (id) {
      booking = await this.MODEL.query().where('id', id).first();
      if (!booking) {
        return false;
      }
    } else {
      booking = new this.MODEL();
      if (user && user.user_type !== 'super admin') {
        if (user.user_type === 'agent') {
          booking.user_id = user.id;
        } else {
          booking.company_id = user.company_id;
        }
      }
    }

    if(data.type === 'general' || !id){
      booking.customer_name = data.customer_name;
      booking.booking_status = data.booking_status;
      booking.group_no = data.group_no;
      booking.group_name = data.group_name;
      booking.category = data.category;
      booking.approval_date = DateTime.fromJSDate(new Date(data.approval_date));
      booking.expected_departure = DateTime.fromJSDate(
        new Date(data.expected_departure)
      );
      booking.confirmed_ticket = data.confirmed_ticket;
      await booking.save();
    }else if (data.type === 'member'){
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
      if(id){
        const member = data;
        delete member.type;
          if (member.id) {
            await booking.related('members').updateOrCreate({},member);
          } else {
            await booking.related('members').create(member);
          }
      }
    }else if (data.type === 'hotel'){
      delete data.type;
      const member = await BookingMemberDetail.query()
        .where('id',id).first();
      if (member){
        if (data.id){
          await member.related('hotelDetails').updateOrCreate({},data);
          if (data.bed_id){
            await updateBedStatus(data.bed_id, 'booked');
          }
        }else {
          await member.related('hotelDetails').create(data);
        }
      }
    }
  }
  public async show({ request, response }: HttpContextContract) {
    const booking = await this.MODEL.query()
      .where('id', request.param('id'))
      .preload('companies')
      .preload('members',(details)=>{details.preload('hotelDetails')}).first();

    if (!booking) {
      return response.notFound({ message: 'booking not found' });
    }
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: booking,
      message: 'Booking Find Successfully',
    });
  }

  public async delete({ params, response }: HttpContextContract) {
    const booking = await this.MODEL.find('id', params.id);

    if (!booking) {
      return response.notFound({ message: 'booking not found' });
    }

    await booking.delete();

    return response.ok({ message: 'booking deleted successfully.' });
  }
}
