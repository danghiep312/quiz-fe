import TokenService from "../helpers/token";
import { Service } from "./axios.service";

const baseUrl = `${Service.defaults.baseURL}`;

export const indexUsers = (filter) => {
  return Service.get(`${baseUrl}/admin/users`, {
    headers: TokenService.getHeader(),
  });
};

export const readUser = (id) => {
  return Service.get(`${baseUrl}/admin/users/${id}`, {
    headers: TokenService.getHeader(),
  });
};

export const createUser = (user) => {
  return Service.post(`${baseUrl}/admin/users`, user, {
    headers: TokenService.getHeader(),
  });
};

export const updateUser = (id, user) => {
  return Service.put(`${baseUrl}/admin/users/${id}`, user, {
    headers: TokenService.getHeader(),
  });
};

export const deleteUser = (userId) => {
  return Service.delete(`${baseUrl}/admin/users/${userId}`, {
    headers: TokenService.getHeader(),
  });
};
