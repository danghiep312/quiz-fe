import TokenService from "../helpers/token";

export const useProfile = () => {
  return TokenService.getUser();
};
