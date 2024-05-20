import axios, { AxiosError } from "axios";

type ComponentProps = {
  error: any | AxiosError;
  message: string;
};

export const requestErrorHandling = ({ error, message }: ComponentProps) => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      throw new Error(
        `${message} ${error.response.status} ${error.response.data}`,
      );
    } else if (error.request) {
      throw new Error(`${message} ${error.request}`);
    }
  } else {
    throw new Error(`${message} ${error.message}`);
  }
};
