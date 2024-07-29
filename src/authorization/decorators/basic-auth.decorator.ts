import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
export const BasicAuth = () => {
  return applyDecorators(
    UseGuards(AuthGuard('basic-auth')),
    // ApiBasicAuth()
  );
};
