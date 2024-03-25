import { useEffect, useState } from "react";
import axios from "axios";

import { auth } from "../../services/firebase";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [interceptor, setInterceptor] = useState(0);

  useEffect(() => {
    const globaInterceptor = axios.interceptors.request.use(
      async (config) => {
        const token = await auth.currentUser?.getIdToken();
        config.headers = Object.assign(config.headers, {
          Authorization: `Bearer ${token}`,
        });
        console.log("Axios interceptor token: ", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return config;
      },
      async (error) => {
        if (error.response.status === 401) {
          // Try once more
          return await axios.request(error.config);
        }

        return error;
      },
    );

    console.log("New interceptor: ", globaInterceptor);

    setInterceptor(globaInterceptor);

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  return children;
};
