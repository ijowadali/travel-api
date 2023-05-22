import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import Company from "App/Models/Company";
import Pagination from "App/Enums/Pagination";
import {BaseController} from "App/Controllers/BaseController";
import HttpCodes from "App/Enums/HttpCodes";

export default class CompanyController extends BaseController {
  public MODEL: typeof Company;

  constructor() {
    super();
    this.MODEL = Company;
  }
  public async index({ request,response }: HttpContextContract) {
    let data = this.MODEL.query();

    return response.send({
      code: 200,
      message: 'Companies find Successfully!',
      result: await data.paginate(
        request.input(Pagination.PAGE_KEY, Pagination.PAGE),
        request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
      ),
    });
  }

  public async create(ctx: HttpContextContract) {
      const checkComapny = await Company.findBy(
        "company_name",
        ctx.request.body().company_name
      );
      if (checkComapny) {
        return ctx.response.conflict({ message: "Company Already Exist" });
      }

  const companySchema = schema.create({
      company_name: schema.string([rules.required()]),
      phone: schema.string.optional(),
      address: schema.string.optional(),
      city: schema.string.optional(),
      state: schema.string.optional(),
      country: schema.string.optional(),
      logo: schema.string.optional(),
    });

    const payload: any = await ctx.request.validate({ schema: companySchema });
    let newCompany = new Company();
    newCompany.company_name = payload.company_name;
    newCompany.phone = payload.phone;
    newCompany.address = payload.address;
    newCompany.city = payload.city;
    newCompany.state = payload.state;
    newCompany.country = payload.country;
    newCompany.logo = payload.logo;

    await newCompany.save();

    return ctx.response.ok({
      data: newCompany,
      message: "Operation Successfully",
    });
  }
  public async show({ params, response }: HttpContextContract) {
    const company = await Company.find(params.companyId);

    if (!company) {
      return response.notFound({ message: "company not found" });
    }
    return response.ok({ data: company, message: "company Find Successfully" });
  }

  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.findBy('id', request.param('id'));
      // return response.send({ status: true, result: data || {} });
      return response.send({
        code: 200,
        message: 'Company find Successfully!',
        result: data,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.toString() });
    }
  }

  public async update({ request, response }: HttpContextContract) {
    try {
      const company = await this.MODEL.findBy('id', request.param('id'));
      if (!company) {
        return response
          .status(HttpCodes.NOT_FOUND)
          .send({ status: false, message: 'Company does not exists!' });
      }

      company.company_name = request.body().company_name;
      company.address = request.body().address;
      company.phone = request.body().phone;
      company.city = request.body().city;
      company.state = request.body().state;
      company.country = request.body().country;
      company.logo = request.body().logo;
      await company.save();
      return response.send({
        code: 200,
        message: 'Company Updated Successfully!',
        result: company,
      });
    } catch (e) {
      return response
        .status(HttpCodes.SERVER_ERROR)
        .send({ status: false, message: e.message });
    }
  }
  public async delete({ params, response }: HttpContextContract) {
    const company = await Company.find(params.compantId);

    if (!company) {
      return response.notFound({ message: "company not found" });
    }

    await company.delete();

    return response.ok({ message: "company deleted successfully." });
  }
}
