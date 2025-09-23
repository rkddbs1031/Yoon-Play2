import { FetchMethod } from '@/types/fetch';
import axios, { AxiosRequestConfig } from 'axios';

const requestURL = process.env.NEXT_PUBLIC_API;

export const fetcher = async <T>(queryKey: string, axiosConfig?: AxiosRequestConfig) => {
  const { data, status } = await axios<T>({
    url: `${requestURL}${queryKey}`,
    method: axiosConfig?.method ?? FetchMethod.POST,
    headers: {
      'Content-Type': 'application/json',
      ...(axiosConfig?.headers ?? {}),
    },
    ...axiosConfig,
  });

  return { data, status };
};
