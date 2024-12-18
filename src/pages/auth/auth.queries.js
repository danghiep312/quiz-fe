import { loginService, registerService } from "../../services/api-auth.service";
import { useMutation, useQueryClient } from "react-query";

export const login = (credentials) => {
  return loginService(credentials);
};

const USERS = "users";
export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation(
    (credentials) =>
      registerService({
        userName: credentials.userName,
        name: credentials.name,
        phoneNumber: credentials.phoneNumber,
        email: credentials.email,
        password: credentials.password,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries(USERS),
    }
  );
};
