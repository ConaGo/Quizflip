import { HttpException, HttpStatus } from '@nestjs/common';

export class ServerErrorException extends HttpException {
  constructor(message) {
    console.log(message);
    const cond = process.env.NODE_ENV == 'development';
    super(
      cond ? message : 'Internal Server Error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
