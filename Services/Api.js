import axios from "axios";

const BASE_URL = "https://crm-customerrelationalmanagement.onrender.com/api";
const Api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

Api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return Api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const callApi = async (
  url,
  method = "post",
  body = null,
  config = {}
) => {
  try {
    const res = await Api({
      url,
      method,
      data: body,
      ...config,
    });
    return res;
  } catch (error) {
    throw error;
  }
};

export default Api;