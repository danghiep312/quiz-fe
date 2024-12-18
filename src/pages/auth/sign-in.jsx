import _ from "lodash";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Checkbox,
  Button,
  Typography,
  Alert,
  Spinner,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { login } from "./auth.queries";
import TokenService from "../../helpers/token";

export function SignIn() {
  const navigateTo = useNavigate();
  const { state } = useLocation();
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
  } = useForm({
    defaultValues: {
      phoneNumberOrEmail: "",
      password: "",
    },
  });

  const onSubmit = async (credentials) => {
    const response = await login({
      phoneNumberOrEmail: credentials.phoneNumberOrEmail,
      password: credentials.password,
    });
    if (response.success) {
      setMessage("");
      setShowAlert(false);
      const user = _.get(response, "data", {});
      const token = _.get(response, "data.accessToken", null);
      if (!token) {
        setMessage("System error, please try again later!");
        setShowAlert(true);
        return false;
      }
      TokenService.setToken(token);
      TokenService.setUser(user);
      navigateTo(state?.path || user.isAdmin ? "/home" : "/contest");
    } else {
      setMessage(response.message);
      setShowAlert(true);
    }
  };

  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className="absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Đăng nhập
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4">
            {showAlert && (
              <Alert
                key="red"
                color="red"
                dismissible={{
                  onClose: () => setShowAlert(false),
                }}
              >
                {message}
              </Alert>
            )}
            <form>
              <section>
                <div className="mb-1rem">
                  <div className="mb-4">
                    <label
                      htmlFor="phoneNumberOrEmail"
                      className="text-mediumgrey mb-1 block text-sm leading-5"
                    >
                      Email hoặc Số điện thoại
                    </label>
                    <input
                      type="text"
                      className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                      name="phoneNumberOrEmail"
                      {...register("phoneNumberOrEmail", {
                        required:
                          "Thông tin này là bắt buộc. Vui lòng nhập đầy đủ.",
                      })}
                    />
                    {errors.phoneNumberOrEmail && (
                      <span role="alert" className="text-xs text-red-500">
                        {errors.phoneNumberOrEmail.message}
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="password"
                      className="text-mediumgrey mb-1 block text-sm leading-5"
                    >
                      Mật khẩu
                    </label>
                    <input
                      type="password"
                      className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                      name="password"
                      {...register("password", {
                        required:
                          "Thông tin này là bắt buộc. Vui lòng nhập đầy đủ.",
                      })}
                    />
                    {errors.password && (
                      <span role="alert" className="text-xs text-red-500">
                        {errors.password.message}
                      </span>
                    )}
                  </div>
                  <div className="-ml-2.5">
                    <Checkbox label="Lưu đăng nhập" />
                  </div>
                </div>
              </section>
            </form>
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              className="flex h-10 items-center justify-center text-sm"
              variant="gradient"
              fullWidth
              onClick={handleSubmit(onSubmit)}
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting && <Spinner className="mr-2 h-4 w-4" />}
              Đăng nhập
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Bạn chưa có tài khoản?
              <Link to="/auth/sign-up">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Đăng ký
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignIn;
