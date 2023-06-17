import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
// import { schema } from "@ioc:Adonis/Core/Validator";
import Booking from "App/Models/Booking";
import Pagination from "App/Enums/Pagination";
import {BaseController} from "App/Controllers/BaseController";
import {DateTime} from "luxon";


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
      // const checkComapny = await Booking.findBy(
      //   "company_name",
      //   ctx.request.body().company_name
      // );
      // if (checkComapny) {
      //   return ctx.response.conflict({ message: "Company Already Exist" });
      // }

  // const companySchema = schema.create({
  //   // company_id: schema.string([rules.required()]),
  //   customer_name: schema.string.optional(),
  //   booking_status: schema.string.optional(),
  //   group_no: schema.number.optional(),
  //   group_name: schema.string.optional(),
  //   category: schema.string.optional(),
  //   // approval_date: schema.date.optional(),
  //   // expected_departure: schema.date.optional(),
  //   confirmed_ticket: schema.boolean.optional(),
  //   });
  //
  //   const payload: any = await ctx.request.validate({ schema: companySchema });
    let newBooking = new Booking();
    const user = auth.user!;
    if (user.user_type !== 'super admin'){
      if (user.user_type === 'agent'){
        newBooking.user_id = user.id;
      }else{
        newBooking.company_id = user.company_id;
      }
    }
    newBooking.customer_name = request.body().customer_name;
    newBooking.booking_status = request.body().booking_status;
    newBooking.group_no = request.body().group_no;
    newBooking.group_name = request.body().group_name;
    newBooking.category = request.body().category;
    newBooking.approval_date = DateTime.fromJSDate(new Date(request.body().approval_date));
    newBooking.expected_departure = DateTime.fromJSDate(new Date(request.body().expected_departure));
    newBooking.confirmed_ticket = request.body().confirmed_ticket;
    await newBooking.save();
    await newBooking.related('bookingVisaDetails').create({
      iata: request.body().visaDetails.iata,
      visaCompany: request.body().visaDetails.visa_company,
      visaStatus: request.body().visaDetails.visa_status,
    })
    await newBooking.related('bookingHotelDetails').create({
      roomType: request.body().hotelDetails.room_type,
      package: request.body().hotelDetails.package,
      hotel1_name: request.body().hotelDetails.hotel1,
      night1: request.body().hotelDetails.night1,
      hotel2_name: request.body().hotelDetails.hotel2,
      night2: request.body().hotelDetails.night2,
      hotel3_name: request.body().hotelDetails.hotel3,
      night3: request.body().hotelDetails.night3,
      // shortBooking
      // adults: ctx.request.body().hotelDetails.adults,
      // children: ctx.request.body().hotelDetails.children,
      // infants: ctx.request.body().hotelDetails.infants
    })
    request.body().members.map((member) => {
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
    await newBooking.related('bookingMemberDetails').createMany(request.body().members)

    return response.ok({
      data: newBooking,
      message: "Operation Successfully",
    });
  }
  public async show({ params, response }: HttpContextContract) {
    const booking = await Booking.find('id', params.id);

    if (!booking) {
      return response.notFound({ message: "booking not found" });
    }
    return response.ok({ data: booking, message: "booking Find Successfully" });
  }

  public async delete({ params, response }: HttpContextContract) {
    const booking = await Booking.find('id', params.id);

    if (!booking) {
      return response.notFound({ message: "booking not found" });
    }

    await booking.delete();

    return response.ok({ message: "booking deleted successfully." });
  }
}
