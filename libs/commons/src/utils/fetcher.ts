import { BadRequestException } from '@nestjs/common';
import axios, { AxiosRequestConfig, Method } from 'axios';

type FetchApi<Payload = undefined> = {
  url: string;
  method: Method;
  config?: AxiosRequestConfig;
  payload?: Payload;
};
// Fetching helper function
export const fetchApi = async <Data, Payload = undefined>(
  args: FetchApi<Payload>,
): Promise<Data> => {
  try {
    const response = await axios({
      method: args.method,
      url: args.url,
      data: args.payload,
      ...args.config,
    });

    return response.data as unknown as Data;
  } catch (error: any) {
    let msg = '';
    if (axios.isAxiosError(error)) {
      msg = error.response?.data?.message || error.message;

      throw new BadRequestException(msg);
    }
    msg = error.message;
    throw new BadRequestException(msg);
  }
};
