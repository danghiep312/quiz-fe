import axios from "axios";
import _ from "lodash";
import TokenService from "../helpers/token";

const baseUrl = "http://127.0.0.1:8010/api/quiz";

const options = {
  baseURL: baseUrl,
};

if (TokenService.getToken() !== null) {
  options.headers = {
    Authorization: `Bearer ${TokenService.getToken()}`,
    Language: _.get(TokenService.getLang(), "", "en"),
  };
}

const axiosInstance = axios.create(options);
const STATUS_UNAUTHORIZED = 401;
const STATUS_TOKEN_EXPIRED = 402;
const STATUS_CODE_FORBIDDEN = 403;
const STATUS_SUCCESS = 200;
const STATUS_SUCCESS_CREATED = 201;
const STATUS_INTERNAL_SERVER_ERROR = 500;

const sendRefreshToken = async (token) => {
  const response = await axios.post(
    `${baseUrl}/refresh-token`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

const logout = () => {
  TokenService.removeToken();
  TokenService.removeRefreshToken();
  TokenService.removeUser();
  window.location.href = "/login";
};

axiosInstance.interceptors.response.use(
  async (response) => {
    const statusCode = _.get(response, "status", STATUS_INTERNAL_SERVER_ERROR);
    if (
      statusCode === STATUS_SUCCESS ||
      statusCode === STATUS_SUCCESS_CREATED
    ) {
      return _.get(response, "data", {});
    }

    if (
      statusCode === STATUS_TOKEN_EXPIRED ||
      statusCode === STATUS_UNAUTHORIZED
    ) {
      logout();
    }

    if (statusCode === STATUS_CODE_FORBIDDEN) {
      window.location.href = "/error-403";
    }
  },

  async (error) => {
    return {
      message: _.get(error.response, "data.message", ""),
      status: _.get(
        error.response,
        "data.statusCode",
        STATUS_INTERNAL_SERVER_ERROR
      ),
      error: _.get(error.response, "data.error", ""),
    };
  }
);

export const Service = axiosInstance;
