import axios from "axios";

const BASE_URL = "https://crm-customerrelationalmanagement.onrender.com/";
const callApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // MUST be true to send refresh token cookie
});

/* ---------- RESPONSE INTERCEPTOR ---------- */
callApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await callApi.post("/auth/refresh");

        const newAccessToken = res.data?.data?.accessToken;
        if (!newAccessToken) throw new Error("No access token");

        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return callApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


/* ---------- REQUEST INTERCEPTOR ---------- */
callApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ---------- RESPONSE INTERCEPTOR ---------- */
callApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loop
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await callApi.post("/auth/refresh");

        const newAccessToken = res.data?.data?.accessToken;
        if (!newAccessToken) throw new Error("No access token");

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return callApi(originalRequest);
      } catch (refreshError) {
        // ❌ DO NOT redirect here
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { callApi };
