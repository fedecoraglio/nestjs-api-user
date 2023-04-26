import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ErrorCode } from '../errors/error-code';
import { PAGINATION_DEFAULT_LIMIT } from '../utils/constant';

export type PaginationOptions = Readonly<{
  skip: number;
  limit: number;
}>;

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const pageQuery = request?.query?.page as string;
    const pageSizeQuery = request?.query?.pageSize as string;
    const page = parseInt(pageQuery, 10);
    const pageSize = parseInt(pageSizeQuery, 10);
    const limit = isNaN(pageSize) ? PAGINATION_DEFAULT_LIMIT : pageSize;

    if (page <= 0 || limit <= 0) {
      throw new HttpException(
        {
          code: ErrorCode.BadPaginationParameters,
          message: 'pagination parameters are not valid',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return {
      skip: (isNaN(page) ? 0 : page - 1) * limit,
      limit,
    } as PaginationOptions;
  },
);
