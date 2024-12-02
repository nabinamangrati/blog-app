import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)  // 1
export class PrismaClientExceptionFilter extends BaseExceptionFilter { // 2
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    console.error(exception.message);  // 3

    // default 500 error code
    super.catch(exception, host);
  }
}