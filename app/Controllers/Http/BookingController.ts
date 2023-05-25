import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import Booking from "App/Models/Booking";
import Pagination from "App/Enums/Pagination";
import {BaseController} from "App/Controllers/BaseController";

export default class BookingController extends BaseController{
  public MODEL: typeof Booking;

  constructor() {
    super();
    this.MODEL = Booking;
  }
  public async index({ request,response }: HttpContextContract) {
    let data = this.MODEL.query();

    return response.send({
      code: 200,
      message: 'Bookings find Successfully!',
      result: await data.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
    });
  }

  public async create(ctx: HttpContextContract) {
      // const checkComapny = await Booking.findBy(
      //   "company_name",
      //   ctx.request.body().company_name
      // );
      // if (checkComapny) {
      //   return ctx.response.conflict({ message: "Company Already Exist" });
      // }

  const companySchema = schema.create({
    // company_id: schema.string([rules.required()]),
    customer_name: schema.string.optional(),
    booking_status: schema.string.optional(),
    group_no: schema.number.optional(),
    group_name: schema.string.optional(),
    category: schema.string.optional(),
    // approval_date: schema.date.optional(),
    // expected_departure: schema.date.optional(),
    confirmed_ticket: schema.boolean.optional(),
    });

    const payload: any = await ctx.request.validate({ schema: companySchema });
    let newBooking = new Booking();
    // newBooking.company_id = payload.company_name;
    newBooking.customer_name = payload.customer_name;
    newBooking.booking_status = payload.booking_status;
    newBooking.group_no = payload.group_no;
    newBooking.group_name = payload.group_name;
    newBooking.category = payload.category;
    newBooking.approval_date = payload.approval_date;
    newBooking.expected_departure = payload.expected_departure;
    newBooking.confirmed_ticket = payload.confirmed_ticket;
    await newBooking.save();
    await newBooking.related('bookingVisaDetails').create({
      iata: ctx.request.body().visaDetails.iata,
      visaCompany: ctx.request.body().visaDetails.visa_company,
      visaStatus: ctx.request.body().visaDetails.visa_status,
    })
    await newBooking.related('bookingHotelDetails').create({
      roomType: ctx.request.body().hotelDetails.room_type,
      package: ctx.request.body().hotelDetails.package,
      hotel1_name: ctx.request.body().hotelDetails.hotel1,
      night1: ctx.request.body().hotelDetails.night1,
      hotel2_name: ctx.request.body().hotelDetails.hotel2,
      night2: ctx.request.body().hotelDetails.night2,
      hotel3_name: ctx.request.body().hotelDetails.hotel3,
      night3: ctx.request.body().hotelDetails.night3,
      // shortBooking
      // adults: ctx.request.body().hotelDetails.adults,
      // children: ctx.request.body().hotelDetails.children,
      // infants: ctx.request.body().hotelDetails.infants
    })
    await newBooking.related('bookingMemberDetails').createMany([{
      firstName: ctx.request.body().members.first_name,
      familyName: ctx.request.body().members.family_name,
      gender: ctx.request.body().members.gender,
      familyHead: ctx.request.body().members.family_head,
      dob: ctx.request.body().members.dob,
      maritalStatus: ctx.request.body().members.marital_status,
      title: ctx.request.body().members.title,
      education: ctx.request.body().members.education,
      nationality: ctx.request.body().members.nationality,
      passport: ctx.request.body().members.passport,
      passportType: ctx.request.body().members.passport_type,
      issueDate: ctx.request.body().members.issue_date,
      expiryDate: ctx.request.body().members.expiry_date,
      relation: ctx.request.body().members.relation,
      mehramName: ctx.request.body().members.mehram_name
    }])

    return ctx.response.ok({
      data: newBooking,
      message: "Operation Successfully",
    });
  }
  public async show({ params, response }: HttpContextContract) {
    const booking = await Booking.find(params.companyId);

    if (!booking) {
      return response.notFound({ message: "booking not found" });
    }
    return response.ok({ data: booking, message: "booking Find Successfully" });
  }

  public async delete({ params, response }: HttpContextContract) {
    const booking = await Booking.find(params.compantId);

    if (!booking) {
      return response.notFound({ message: "booking not found" });
    }

    await booking.delete();

    return response.ok({ message: "booking deleted successfully." });
  }
}
