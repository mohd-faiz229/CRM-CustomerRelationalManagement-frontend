import axios from "axios";

// Detect the correct Base URL
const BASE_URL = process.env.VITE_API_URL || process.env.LOCAL_API_URL;

const Api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// --- REQUEST INTERCEPTOR ---
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

// --- RESPONSE INTERCEPTOR (For Refreshing Token) ---
Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Use the absolute BASE_URL here to ensure refresh works on both Local and Render
        const res = await axios.post(`${BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return Api(originalRequest);
      } catch (err) {
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

// --- API CALL HELPER ---
export const callApi = async (url, method = "get", body = null) => {
  try {
    const res = await Api({
      url: url, // DO NOT hardcode a path here; use the passed variable
      method,
      data: body,
    });
    return res;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export default Api;