import TokenService from "../helpers/token";
import { Service } from "./axios.service";

const baseUrl = `${Service.defaults.baseURL}`;

export const indexQuestions = (filter) => {
  return Service.get(`${baseUrl}/admin/questions`, {
    headers: TokenService.getHeader(),
  });
};

export const readQuestion = (questionId) => {
  return Service.get(`${baseUrl}/admin/questions/${questionId}`, {
    headers: TokenService.getHeader(),
  });
};

export const deleteQuestion = (questionId) => {
  return Service.delete(`${baseUrl}/admin/questions/${questionId}`, {
    headers: TokenService.getHeader(),
  });
};

export const updateQuestion = (id, question) => {
  return Service.put(`${baseUrl}/admin/questions/${id}`, question, {
    headers: TokenService.getHeader(),
  });
};

export const createQuestion = (question) => {
  return Service.post(`${baseUrl}/admin/questions`, question, {
    headers: TokenService.getHeader(),
  });
};
