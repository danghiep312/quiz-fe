import TokenService from "../helpers/token";
import { Service } from "./axios.service";

const baseUrl = `${Service.defaults.baseURL}`;

export const indexExams = (filter) => {
  return Service.get(`${baseUrl}/admin/exams`, {
    headers: TokenService.getHeader(),
  });
};

export const readExam = (examId) => {
  return Service.get(`${baseUrl}/admin/exams/${examId}`, {
    headers: TokenService.getHeader(),
  });
};

export const deleteExam = (examId) => {
  return Service.delete(`${baseUrl}/admin/exams/${examId}`, {
    headers: TokenService.getHeader(),
  });
};

export const updateExam = (id, exam) => {
  return Service.put(`${baseUrl}/admin/exams/${id}`, exam, {
    headers: TokenService.getHeader(),
  });
};

export const createExam = (exam) => {
  return Service.post(`${baseUrl}/admin/exams`, exam, {
    headers: TokenService.getHeader(),
  });
};

export const submitExam = (submit) => {
  return Service.post(`${baseUrl}/exams/submit`, submit, {
    headers: TokenService.getHeader(),
  });
};
