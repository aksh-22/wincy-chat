import { axiosInstance } from "./axiosInstance";

export const signup = (data) => {
  return axiosInstance.post(`/users`, data).then((res) => res.data);
};
export const login = (data) => {
  return axiosInstance.post(`/auth/login`, data).then((res) => res.data);
};
export const logout = () => {
  return axiosInstance.post(`/auth/logout`);
};
export const inviteRegistration = (token, data) => {
  return axiosInstance.post(`/users/${token}`, data);
};

export const updatePassword = (data) => {
  return axiosInstance.patch("/auth/change-password", data).then((res) => res);
};

export const passwordResetRequest = (data) => {
  return axiosInstance.post("/auth/reset-request", data);
};

export const passwordReset = (data) => {
  return axiosInstance.patch("/auth/reset-password", data);
};
