import { UserService } from '@/api/identity/user/user.service';
import {
  applyDecorators,
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

export class AuthenticationGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext): any {
    if (context.getType() === 'http') {
      return context.switchToHttp().getRequest();
    }

    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}

// {tenant}.erpbd.dev

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UserService,
  ) {}

  hasPermission(
    collectionName: string,
    requiredPrivileges: string[],
    userAllocatedPermissions: { collectionName: string; actions: string[] }[],
  ) {
    // console.log('hasPermission', { collectionName, actions, permissions });

    const matchedPermission = userAllocatedPermissions.find(
      (p) => p.collectionName == collectionName,
    );

    if (!matchedPermission) {
      return false; // No permissions for the specified collection
    }

    // return requiredPrivileges.some((action) =>
    //   matchedPermission.actions.includes(action),
    // );

    const matchedPermissionPreviliges = matchedPermission.actions ?? [];

    // console.log({
    //   matchedPermissionPreviliges,
    //   requiredPrivileges,
    // });

    return matchedPermissionPreviliges.some((privilege) =>
      requiredPrivileges.includes(privilege),
    );
  }

  async canActivate(context: ExecutionContext) {
    const requiredPrivileges = this.reflector.get<string[]>(
      'privileges',
      context.getHandler(),
    );

    console.log(requiredPrivileges);

    // const collectionName = this.reflector.get<string>(
    //   'collectionName',
    //   context.getHandler(),
    // );

    // console.log({ requiredActionPermissions, collectionName });

    // let user: IAuthUser;
    // if (context.getType() === 'http') {
    //   // const request = context.switchToHttp().getRequest();
    //   // user = request.user;
    //   return true;
    // } else {
    //   const ctx = GqlExecutionContext.create(context);
    //   const gqlRequest = ctx.getContext().req;
    //   const tenantUID = gqlRequest.headers['x-tenant'];

    //   const identityUser = await this.userService.userModel
    //     .findOne({ _id: gqlRequest.user?.sub })
    //     .select('systemRoles memberships');

    //   if (tenantUID) {
    //     const selectedTenant = identityUser?.memberships?.find(
    //       (m) => m.tenant === tenantUID,
    //     );
    //     if (!selectedTenant) return false;
    //     const tenantRoles = selectedTenant.roles;

    //     const roles = await this.rolesService.roleModel.find({
    //       name: { $in: tenantRoles },
    //     });

    //     const roleCombinedPermissions = roles.reduce((acc, curr) => {
    //       return [...acc, ...curr.permissions];
    //     }, []);

    //     return this.hasPermission(
    //       collectionName,
    //       requiredPrivileges,
    //       roleCombinedPermissions,
    //     );
    //   }

    //   if (!tenantUID) {
    //     if (!Boolean(identityUser?.systemRoles)) {
    //       return false;
    //     }

    //     const roles = await this.rolesService.roleModel.find({
    //       name: { $in: identityUser.systemRoles },
    //     });

    //     const roleCombinedPermissions = roles.reduce((acc, curr) => {
    //       return [...acc, ...curr.permissions];
    //     }, []);

    //     return this.hasPermission(
    //       collectionName,
    //       requiredPrivileges,
    //       roleCombinedPermissions,
    //     );
    //   }
    // }

    return true;
  }
}

export type TPermissionPrivilege =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | '*';

interface IAuthenticatorOptions {
  collectionName?: string;
  privileges?: TPermissionPrivilege[];
}

export const Authenticated = (options?: IAuthenticatorOptions) => {
  const decorators = [
    UseGuards(new AuthenticationGuard()),
    // --
    SetMetadata('privileges', options?.privileges),
    SetMetadata('collectionName', options?.collectionName ?? undefined),
    ApiBearerAuth(),
  ];

  if (options?.privileges && options?.privileges.length > 0) {
    decorators.push(UseGuards(PermissionGuard));
  }

  return applyDecorators(...decorators);
};
