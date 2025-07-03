import { UserSession as UserSessionType } from '@/auth/auth.type';
import {
  ContextType,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { type FastifyRequest } from 'fastify';

export type CurrentUserSession = UserSessionType & {
  headers: FastifyRequest['headers'];
};

export const CurrentUserSession = createParamDecorator(
  (
    data: keyof UserSessionType | 'headers',
    ctx: ExecutionContext,
  ): CurrentUserSession => {
    const contextType: ContextType= ctx.getType();

    let request: FastifyRequest & UserSessionType;
    request = ctx.switchToHttp().getRequest();

    return data == null
      ? {
          ...request,
          headers: request?.headers,
        }
      : request.session?.[data];
  },
);
