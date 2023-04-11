import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";

interface NetResponse<T> {
  data: T;
}

const instance: AxiosInstance = axios.create({
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截处理
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 返回拦截处理
instance.interceptors.response.use(
  function (res: AxiosResponse<NetResponse<any>>) {
    // 对响应数据做点什么
    return res;
  },
  function (error: AxiosError) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export const request = async <T>(api: string, params: any): Promise<T> => {
  try {
    const res:any = await instance.post<NetResponse<T>>(api, params);
    return res.data;
  } catch (error) {
    throw error;
  }
};
