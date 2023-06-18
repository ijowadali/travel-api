import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { BaseController } from 'App/Controllers/BaseController';
import { RegistorValidator } from 'App/Validators/user/RegistorValidator';
import User from 'App/Models/User';
import HttpCodes from 'App/Enums/HttpCodes';
import ResponseMessages from 'App/Enums/ResponseMessages';
import Pagination from 'App/Enums/Pagination';
// import { imageUpload } from "App/Helpers/MainHelpers";

export default class UsersController extends BaseController {
  public MODEL: typeof User;

  constructor() {
    super();
    this.MODEL = User;
  }
  // create new user
  public async create({ request, response }: HttpContextContract) {
    const payload = await request.validate(RegistorValidator);
    try {
      let user = await this.MODEL.findBy('email', request.body().email);
      if (user && !user.isEmailVerified) {
        delete user.$attributes.password;
        return response.conflict({
          status: HttpCodes.CONFLICTS,
          message: 'Already exists',
          result: { user: user, verified: false },
        });
      }
      user = await this.MODEL.create(payload);
      user.related('roles').sync([request.body().roles]);
      await user.related('profile').create(request.body().profile);
      delete user.$attributes.password;
      return response.ok({
        status: HttpCodes.SUCCESS,
        message: 'User Register Successfully',
        result: user,
      });
    } catch (e) {
      console.log('register error', e.toString());
      return response.internalServerError({
        status: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }

  // find user  list
  public async find({ request, response }: HttpContextContract) {
    let data = this.MODEL.query();

    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'Users Found Successfully',
      result: await data
        .preload('permissions')
        .preload('roles', (rolesQuery) => {
          rolesQuery.preload('permissions');
        })
        .preload('profile')
        .preload('company')
        .paginate(
          request.input(Pagination.PAGE_KEY, Pagination.PAGE),
          request.input(Pagination.PER_PAGE_KEY, Pagination.PER_PAGE)
        ),
    });
  }

  // find single user by id
  public async get({ request, response }: HttpContextContract) {
    try {
      const data = await this.MODEL.query()
        .where('id', request.param('id'))
        // .preload('profile')
        .first();

      if (data) {
        delete data.$attributes.password;
      }

      return response.ok({
        code: HttpCodes.SUCCESS,
        message: 'User find Successfully!',
        result: data,
      });
    } catch (e) {
      console.log(e);
      return response.internalServerError({
        code: HttpCodes.SERVER_ERROR,
        message: e.toString(),
      });
    }
  }
  // update user
  public async update({ request, response }: HttpContextContract) {
    const user = await this.MODEL.findBy('id', request.param('id'));
    if (!user) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User Not Found',
      });
    }
    user.email = request.body().email;
    user.related('permissions').sync(request.body().permissions);
    user.related('roles').sync(request.body().roles);
    await user.related('profile').updateOrCreate({}, request.body().profile);

    delete user.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User Update successfully.',
      result: user,
    });
  }
  // update user profile
  public async profileUpdate({ request, response }: HttpContextContract) {
    const user = await this.MODEL.findBy('id', request.param('id'));
    if (!user) {
      return response.notFound({
        code: HttpCodes.NOT_FOUND,
        message: 'User Not Found',
      });
    }

    user.related('profile').updateOrCreate(
      {},
      {
        first_name: request.body().first_name,
        last_name: request.body().last_name,
        phone_number: request.body().phone_number,
        address: request.body().address,
        city: request.body().city,
        state: request.body().state,
        country: request.body().country,
      }
    );

    delete user.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User Profile Update successfully.',
      result: user,
    });
  }

  // delete single user using id
  public async destroy({ request, response }: HttpContextContract) {
    const data = await this.MODEL.findBy('id', request.param('id'));
    if (!data) {
      return response.notFound({
        status: HttpCodes.NOT_FOUND,
        message: 'User not found',
      });
    }
    await data.delete();
    return response.ok({
      code: HttpCodes.SUCCESS,
      result: { message: 'User deleted successfully' },
    });
  }

  // auth user
  public async authenticated({ auth, response }: HttpContextContract) {
    const authenticatedUser = auth.user;
    if (!authenticatedUser) {
      return response.unauthorized({
        code: HttpCodes.UNAUTHORIZED,
        message: ResponseMessages.UNAUTHORIZED,
      });
    }
    delete authenticatedUser.$attributes.password;
    return response.ok({
      code: HttpCodes.SUCCESS,
      message: 'User find Successfully',
      result: auth.user,
    });
  }
}
