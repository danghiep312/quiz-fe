// import TokenService from "../helpers/token";
import { Service } from "./axios.service";

const baseUrl = `${Service.defaults.baseURL}`;

export const loginService = (data) => {
  return Service.post(`${baseUrl}/auth/login`, data);
};

export const registerService = (data) => {
  return Service.post(`${baseUrl}/auth/register`, data);
}