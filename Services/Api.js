import axios from "axios";

const Api = axios.create({
  baseURL: "https://crm-customerrelationalmanagement.onrender.com",
  withCredentials: true, // ensures refresh token cookie is sent
});

// =========================
// REQUEST INTERCEPTOR
// =========================
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

// =========================
// RESPONSE INTERCEPTOR
// =========================
Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // prevent retry loop
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // check if access token expired (401) and refresh token exists in cookie
    if (error.response?.status === 401) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://localhost:3000/api/auth/refresh-token",
          {},
          { withCredentials: true } // send cookie
        );

        const newAccessToken = res.data.accessToken;

        if (!newAccessToken) throw new Error("No new access token returned");

        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return Api(originalRequest);
      } catch (err) {
        // refresh token invalid or expired
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

// =========================
// API CALL HELPER
// =========================
export const callApi = async (url, method = "get", body = null) => {
  try {
    const res = await Api({
      url: `/api${url}`,
      method,
      data: body,
    });
    return res;
  } catch (error) {
    console.error("API Error :", error);
    throw error;
  }
};

export default Api;
