import { HTTP_STATUS, type HttpStatusCode } from "./httpStatus.js";

export class AppError extends Error {
  public readonly statusCode: HttpStatusCode;
  public readonly isOperational: boolean;

  constructor(
    statusCode: HttpStatusCode,
    message: string,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }

  // ============ Factory Methods ============

  static badRequest(message: string = "Bad request") {
    return new AppError(HTTP_STATUS.BAD_REQUEST, message);
  }

  static unauthorized(message: string = "Unauthorized") {
    return new AppError(HTTP_STATUS.UNAUTHORIZED, message);
  }

  static forbidden(message: string = "Forbidden") {
    return new AppError(HTTP_STATUS.FORBIDDEN, message);
  }

  static notFound(message: string = "Resource not found") {
    return new AppError(HTTP_STATUS.NOT_FOUND, message);
  }

  static conflict(message: string = "Resource already exists") {
    return new AppError(HTTP_STATUS.CONFLICT, message);
  }

  static internal(message: string = "Internal server error") {
    return new AppError(HTTP_STATUS.INTERNAL_SERVER_ERROR, message, false);
  }
}
