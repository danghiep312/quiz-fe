import _ from "lodash";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Checkbox,
  Button,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { useFormik } from "formik";
import { EMessage } from "../user/user.constant";
import { phoneRegex, emailRegex, userNameRegex } from "./auth.constant";
import { useRegister } from "./auth.queries";
import Swal from "sweetalert2";

const validator = (submitValue) => {
  const { name, userName, email, phoneNumber } = submitValue;
  const validates = {};
  if (!name) {
    validates["name"] = EMessage.REQUIRED_FIELD;
  } else if (name.trim().length === 0) {
    validates["name"] = EMessage.NOT_EMPTY;
  } else {
    if (!userNameRegex.test(name)) {
      validates["name"] = EMessage.INVALID_NAME;
    }
  }
  if (!userName) {
    validates["userName"] = EMessage.REQUIRED_FIELD;
  } else if (userName.trim().length === 0) {
    validates["userName"] = EMessage.NOT_EMPTY;
  } else {
    if (!userNameRegex.test(userName)) {
      validates["userName"] = EMessage.INVALID_USERNAME;
    }
  }
  if (phoneNumber && !phoneRegex.test(phoneNumber)) {
    validates.phoneNumber = EMessage.INVALID_PHONE;
  }
  if (email && !emailRegex.test(email)) {
    validates["email"] = EMessage.INVALID_MAIL;
  }
  const message = "Thông tin này là bắt buộc. Vui lòng nhập đầy đủ.";
  for (const key in submitValue) {
    if (!submitValue[key] && key !== "status") {
      validates[key] = message;
    }
  }
  return validates;
};

export function SignUp() {
  const { mutateAsync: createUser, isLoading: isCreateUserLoading } =
    useRegister();
  const navigateTo = useNavigate();

  const saveUser = () => {
    createUser(values, {
      onSuccess: (response) => {
        if (response.id) {
          Swal.fire({
            icon: "success",
            text: "Register successfully. Please log in to access the system!",
            showConfirmButton: false,
            timer: 1500,
          });
          navigateTo("/auth/sign-in");
        } else {
          Swal.fire({
            icon: "error",
            text: response.message,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "System Error",
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  };

  const { values, errors, handleSubmit, handleChange } = useFormik({
    initialValues: {
      name: "",
      userName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    enableReinitialize: true,
    validate: validator,
    onSubmit: () => {
      saveUser();
    },
  });

  return (
    <>
      <img
        src="https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 z-0 h-full w-full bg-black/50" />
      <div className="container mx-auto p-4">
        <Card className=" absolute top-2/4 left-2/4 w-full max-w-[24rem] -translate-y-2/4 -translate-x-2/4">
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-4 grid h-28 place-items-center"
          >
            <Typography variant="h3" color="white">
              Đăng ký
            </Typography>
          </CardHeader>
          <CardBody className=" max-h-5/6 flex flex-col gap-4 overflow-y-auto">
            <div>
              <label
                htmlFor="name"
                className="text-mediumgrey mb-1 block text-sm leading-5"
              >
                Họ tên
              </label>
              <input
                type="text"
                className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                name="name"
                value={values.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span role="alert" className="text-xs text-red-500">
                  {errors.name}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="userName"
                className="text-mediumgrey mb-1 block text-sm leading-5"
              >
                Tài khoản
              </label>
              <input
                type="text"
                className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                name="userName"
                value={values.userName}
                onChange={handleChange}
              />
              {errors.userName && (
                <span role="alert" className="text-xs text-red-500">
                  {errors.userName}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="text-mediumgrey mb-1 block text-sm leading-5"
              >
                Số điện thoại
              </label>
              <input
                type="text"
                className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
              />
              {errors.phoneNumber && (
                <span role="alert" className="text-xs text-red-500">
                  {errors.phoneNumber}
                </span>
              )}
            </div>
            <div>
              <label
                htmlFor="email"
                className="text-mediumgrey mb-1 block text-sm leading-5"
              >
                Email
              </label>
              <input
                type="text"
                className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span role="alert" className="text-xs text-red-500">
                  {errors.email}
                </span>
              )}
            </div>
            <div>
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
                value={values.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span role="alert" className="text-xs text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
            {/* <div className="-ml-2.5">
              <Checkbox label="Tôi đồng ý với điều khoản và điều kiện" />
            </div> */}
          </CardBody>
          <CardFooter className="pt-0">
            <Button
              variant="gradient"
              fullWidth
              className="flex justify-center"
              onClick={() => handleSubmit()}
              disabled={isCreateUserLoading || !_.isEmpty(errors)}
            >
              {isCreateUserLoading && <Spinner className="mr-2 h-4 w-4" />}
              Đăng ký
            </Button>
            <Typography variant="small" className="mt-6 flex justify-center">
              Bạn đã có tài khoản?
              <Link to="/auth/sign-in">
                <Typography
                  as="span"
                  variant="small"
                  color="blue"
                  className="ml-1 font-bold"
                >
                  Đăng nhập
                </Typography>
              </Link>
            </Typography>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

export default SignUp;
