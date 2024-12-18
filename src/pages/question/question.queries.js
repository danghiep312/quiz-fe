import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  indexQuestions,
  deleteQuestion,
  readQuestion,
  updateQuestion,
  createQuestion,
} from "../../services/api-question.service";

const QUESTIONS = "questions";
const QUESTION_DETAIL = "questionDetail";

export const useQuestions = (params) => {
  return useQuery({
    queryKey: [QUESTIONS, params],
    queryFn: () => {
      return indexQuestions(params);
    },
    keepPreviousData: true,
  });
};

export const useDeleteQuestion = (questionId) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteQuestion(questionId), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUESTIONS);
      queryClient.invalidateQueries(QUESTION_DETAIL);
    },
  });
};

export const useReadQuestion = (id) => {
  return useQuery([QUESTION_DETAIL, id], async () => {
    return readQuestion(id);
  });
};

export const useUpdateQuestion = (id) => {
  const queryClient = useQueryClient();
  return useMutation((question) => updateQuestion(id, question), {
    onSuccess: () => {
      queryClient.invalidateQueries(QUESTIONS);
      queryClient.invalidateQueries([QUESTION_DETAIL, id]);
    },
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation((question) => createQuestion(question), {
    onSuccess: () => queryClient.invalidateQueries(QUESTIONS),
  });
};
