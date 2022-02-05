import { ResponseError } from '../interfaces/response-error.interface';

export const GlobalResponseErrorHelper = (statusCode: number, message: string, error?: string[]): ResponseError => {
  const response: ResponseError = {
    statusCode,
    message,
  };

  if (error) {
    response.error = error;
  }

  return response;
};
