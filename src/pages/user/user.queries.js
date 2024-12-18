import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  indexUsers,
  deleteUser,
  createUser,
  updateUser,
  readUser,
} from "../../services/api-user.service";

const USERS = "users";
const USER_DETAIL = "userDetail";

export const useUsers = (params) => {
  return useQuery({
    queryKey: [USERS, params],
    queryFn: () => {
      return indexUsers(params);
    },
    keepPreviousData: true,
  });
};

export const useReadUser = (id) => {
  return useQuery([USER_DETAIL, id], async () => {
    return readUser(id);
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation((user) => createUser(user), {
    onSuccess: () => queryClient.invalidateQueries(USERS),
  });
};

export const useUpdateUser = (id) => {
  const queryClient = useQueryClient();
  return useMutation((user) => updateUser(id, user), {
    onSuccess: () => {
      queryClient.invalidateQueries(USERS);
      queryClient.invalidateQueries([USER_DETAIL, id]);
    },
  });
};

export const useDeleteUser = (id) => {
  const queryClient = useQueryClient();
  return useMutation(() => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(USERS);
      queryClient.invalidateQueries([USER_DETAIL, id]);
    },
  });
};
