import Controller from '@curveball/controller';
import { Context } from '@curveball/core';
import * as privilegeService from '../../privilege/service.js';
import * as hal from '../formats/hal.js';
import { PrincipalService } from '../../principal/service.js';
import { PrincipalEdit } from '../../api-types.js';

class AppController extends Controller {

  async get(ctx: Context) {

    const principalService = new PrincipalService(ctx.privileges);
    const app = await principalService.findByExternalId(ctx.params.id, 'app');

    const isAdmin = ctx.privileges.has('admin');

    const principalPrivileges = await privilegeService.get(app);
    ctx.response.body = hal.item(
      app,
      principalPrivileges.getAll(),
      isAdmin,
      await principalService.findGroupsForPrincipal(app),
    );

  }

  async put(ctx: Context) {

    const principalService = new PrincipalService(ctx.privileges);

    ctx.request.validate<PrincipalEdit>(
      'https://curveballjs.org/schemas/a12nserver/principal-edit.json'
    );

    const user = await principalService.findByExternalId(ctx.params.id, 'app');
    user.active = !!ctx.request.body.active;
    user.nickname = ctx.request.body.nickname;

    await principalService.save(user);
    ctx.status = 204;

  }

}

export default new AppController();
