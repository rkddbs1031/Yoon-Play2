import { ErrorCode } from '@/constants/error';

export interface ApiErrorResponse {
  success: false;
  code: ErrorCode;
  message: string;
}

export interface CustomAxiosError {
  response?: {
    data: ApiErrorResponse;
  };
  message: string;
}
