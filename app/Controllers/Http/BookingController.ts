import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Booking from "App/Models/Booking";

export default class BookingController {
  public async index({ response }: HttpContextContract) {
    const companies = await Booking.all();
    return response.ok({
      result: companies,
      message: "Bookings Find Successfully",
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
    company_id: schema.string([rules.required()]),
    // booking_number: schema.string.optional(),
    customer_name: schema.string.optional(),
    booking_status: schema.string.optional(),
    group_no: schema.number.optional(),
    group_name: schema.string.optional(),
    category: schema.string.optional(),
    approval_date: schema.date.optional(),
    expected_departure: schema.date.optional(),
    confirmed_ticket: schema.boolean.optional(),
    });

    const payload: any = await ctx.request.validate({ schema: companySchema });
    let newBooking = new Booking();
    newBooking.company_id = payload.company_name;
    newBooking.booking_number = payload.booking_number;
    newBooking.customer_name = payload.customer_name;
    newBooking.booking_status = payload.booking_status;
    newBooking.group_no = payload.group_no;
    newBooking.group_name = payload.group_name;
    newBooking.category = payload.category;
    newBooking.approval_date = payload.approval_date;
    newBooking.expected_departure = payload.expected_departure;
    newBooking.confirmed_ticket = payload.confirmed_ticket;

    await newBooking.save();

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
