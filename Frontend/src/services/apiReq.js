import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Set your base API URL here
});


// Add request interceptor to attach tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for handling token refresh logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const response = await axios.post(
            "http://localhost:3000/auth/refresh-token",
            { refreshToken }
          );
          const newToken = response.data.accessToken;
          localStorage.setItem("authToken", newToken);

          // Retry the original request with the new token
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(error.config);
        } catch (refreshError) {
          console.error("Failed to refresh token", refreshError);
          localStorage.removeItem("authToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login"; // Redirect to login
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available, log out the user
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
