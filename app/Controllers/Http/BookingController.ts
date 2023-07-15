import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
// import { schema } from "@ioc:Adonis/Core/Validator";
import Booking from "App/Models/Booking";
import Pagination from "App/Enums/Pagination";
import {BaseController} from "App/Controllers/BaseController";
import {DateTime} from "luxon";
import HttpCodes from "App/Enums/HttpCodes";
import * as console from "console";


export default class BookingController extends BaseController{
  public MODEL: typeof Booking;

  constructor() {
    super();
    this.MODEL = Booking;
  }
  public async index({ auth, request,response }: HttpContextContract) {
    const user = auth.user!;
    let bookingQuery = this.MODEL.query();

    // Conditionally apply the where clause based on the user_type
    if (user.user_type !== 'super admin') {
      if (user.user_type === 'agent'){
        bookingQuery = bookingQuery.where('user_id', user.id);
      }else {
        bookingQuery = bookingQuery.where('company_id', user.company_id);
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
    await this.mapBooking(null,data,user)
    return response.ok({
      message: "Operation Successfully",
    });
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const data = request.body();
      await this.mapBooking(request.param('id'), data,null);
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

    booking.customer_name = data.customer_name;
    booking.booking_status = data.booking_status;
    booking.group_no = data.group_no;
    booking.group_name = data.group_name;
    booking.category = data.category;
    booking.approval_date = DateTime.fromJSDate(new Date(data.approval_date));
    booking.expected_departure = DateTime.fromJSDate(new Date(data.expected_departure));
    booking.confirmed_ticket = data.confirmed_ticket;
    await booking.save();

    const visaDetailsData = {
      iata: data.visaDetails.iata,
      visaCompany: data.visaDetails.visa_company,
      visaStatus: data.visaDetails.visa_status,
    };
    await booking.related('visaDetails').updateOrCreate({}, visaDetailsData);

    const hotelDetailsData = {
      roomType: data.hotelDetails.room_type,
      package: data.hotelDetails.package,
    };

    if (
      data.hotelDetails.hotel1 ||
      data.hotelDetails.hotel2 ||
      data.hotelDetails.hotel3
    ) {
      hotelDetailsData['hotel1_name'] = data.hotelDetails.hotel1 || null;
      hotelDetailsData['hotel2_name'] = data.hotelDetails.hotel2 || null;
      hotelDetailsData['hotel3_name'] = data.hotelDetails.hotel3 || null;
      hotelDetailsData['night1'] = data.hotelDetails.night1 || null;
      hotelDetailsData['night2'] = data.hotelDetails.night2 || null;
      hotelDetailsData['night3'] = data.hotelDetails.night3 || null;
    }
    await booking.related('hotelDetails').updateOrCreate({}, hotelDetailsData);

    data.members.map((member) => {
      if (member.dob instanceof Date) {
        member.dob = DateTime.fromJSDate(new Date(member.dob));
      } else if (typeof member.dob === 'number') {
        member.dob = DateTime.fromJSDate(new Date(member.dob));
      }
      if (member.issue_date instanceof Date) {
        member.issue_date = DateTime.fromJSDate(new Date(member.issue_date));
      } else if (typeof member.issue_date === 'number') {
        member.issue_date = DateTime.fromJSDate(new Date(member.issue_date));
      }
      if (member.expiry_date instanceof Date) {
        member.expiry_date = DateTime.fromJSDate(new Date(member.expiry_date));
      } else if (typeof member.expiry_date === 'number') {
        member.expiry_date = DateTime.fromJSDate(new Date(member.expiry_date));
      }
      return member;
    });
console.log(data.members);
    await booking.related('members').updateOrCreateMany(data.members);
  }
  public async show({ params, response }: HttpContextContract) {
    const booking = await this.MODEL.query().where('bookings.id', params.id).leftJoin('companies', 'bookings.company_id', 'companies.id').first();
    if (booking !== null) {
      await booking.load('members');
      await booking.load('visaDetails');
      await booking.load('hotelDetails');
    }
    if (!booking) {
      return response.notFound({ message: "booking not found" });
    }
    return response.ok({ code: HttpCodes.SUCCESS,result: booking, message: "Booking Find Successfully" });
  }

  public async delete({ params, response }: HttpContextContract) {
    const booking = await this.MODEL.find('id', params.id);

    if (!booking) {
      return response.notFound({ message: "booking not found" });
    }

    await booking.delete();

    return response.ok({ message: "booking deleted successfully." });
  }
}
