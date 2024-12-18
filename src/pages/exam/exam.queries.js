import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  indexExams,
  deleteExam,
  createExam,
  readExam,
  updateExam,
  submitExam,
} from "../../services/api-exam.service";

const EXAMS = "exams";
const EXAM_DETAIL = "examDetail";
const EXAMS_SUBMIT = "examSubmit";

export const useExams = (params) => {
  return useQuery({
    queryKey: [EXAMS, params],
    queryFn: () => {
      return indexExams(params);
    },
    keepPreviousData: true,
  });
};

export const useDeleteExam = (examId) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteExam(examId), {
    onSuccess: () => {
      queryClient.invalidateQueries(EXAMS);
      queryClient.invalidateQueries(EXAM_DETAIL);
    },
  });
};

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation((exam) => createExam(exam), {
    onSuccess: () => queryClient.invalidateQueries(EXAMS),
  });
};

export const useReadExam = (id) => {
  return useQuery([EXAM_DETAIL, id], async () => {
    return readExam(id);
  });
};

export const useUpdateExam = (id) => {
  const queryClient = useQueryClient();
  return useMutation((exam) => updateExam(id, exam), {
    onSuccess: () => {
      queryClient.invalidateQueries(EXAMS);
      queryClient.invalidateQueries([EXAM_DETAIL, id]);
    },
  });
};

export const useSubmitExam = () => {
  const queryClient = useQueryClient();
  return useMutation((exam) => submitExam(exam), {
    onSuccess: () => queryClient.invalidateQueries(EXAMS_SUBMIT),
  });
};
