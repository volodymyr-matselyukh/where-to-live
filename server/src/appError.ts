// exceptions/AppError.ts

export enum HttpCode {  
	OK = 200,
	BAD_REQUEST = 400,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500 }

interface AppErrorArgs {
	statusCode: HttpCode;
  	description: string;
}

export class AppError extends Error {
  public readonly statusCode: HttpCode;

  constructor(args: AppErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.statusCode = args.statusCode;

    Error.captureStackTrace(this);
  }
}