import { useForm } from "react-hook-form";
import { useCreateUser } from "./user.queries";
import { Button } from "@material-tailwind/react";
import { emailRegex, userNameRegex } from "../auth/auth.constant";
import Swal from "sweetalert2";

export const CreateModal = ({ isShow, setCreateShowModal }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isValid, errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      userName: "",
      imageUrl: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
  });

  const onSubmit = (user) => {
    if (!isValid) return;
    createUser(user, {
      onSuccess: (response) => {
        if (response.id) {
          reset();
          setCreateShowModal(false);
          Swal.fire({
            position: "center",
            icon: "success",
            text: "Dữ liệu đã được thêm",
            showConfirmButton: false,
            timer: 1500,
          });
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
          title: "Dữ liệu chưa được thêm.",
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  };

  const { mutateAsync: createUser, isLoading: isCreateUserLoading } =
    useCreateUser();

  return (
    <>
      {isShow ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full min-w-[768px] flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="border-slate-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                  <h3 className="text-xl font-semibold">Thêm người dùng</h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                    onClick={() => setCreateShowModal(false)}
                  >
                    <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative flex-auto p-6">
                  <form>
                    <section>
                      <div className="mb-1rem">
                        <div className="mb-4">
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
                            {...register("name", {
                              required:
                                "Thông tin này là bắt buộc. Vui lòng nhập đầy đủ.",
                            })}
                          />
                          {errors.name && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.name.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
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
                            {...register("userName", {
                              required:
                                "Thông tin này là bắt buộc. Vui lòng nhập đầy đủ.",
                              pattern: {
                                value: userNameRegex,
                                message:
                                  "Tên tài khoản chỉ được bao gồm chữ cái và số",
                              },
                            })}
                          />
                          {errors.userName && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.userName.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="imageUrl"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Avatar
                          </label>
                          <input
                            type="text"
                            className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                            name="imageUrl"
                            {...register("imageUrl", {
                              required:
                                "Thông tin này là bắt buộc. Vui lòng nhập đầy đủ.",
                            })}
                          />
                          {errors.imageUrl && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.imageUrl.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
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
                            {...register("phoneNumber", {
                              required:
                                "Thông tin này là bắt buộc. Vui lòng nhập đầy đủ.",
                            })}
                          />
                          {errors.phoneNumber && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.phoneNumber.message}
                            </span>
                          )}
                        </div>
                        <div className="mb-4">
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
                            {...register("email", {
                              required:
                                "Thông tin này là bắt buộc. Vui lòng nhập đầy đủ.",
                              pattern: {
                                value: emailRegex,
                                message:
                                  "Thông tin đã nhập chưa đúng định dạng email.",
                              },
                            })}
                          />
                          {errors.email && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.email.message}
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
                      </div>
                    </section>
                  </form>
                </div>
                {/*footer*/}
                <div className="border-slate-200 flex items-center justify-end rounded-b border-t border-solid p-6">
                  <button
                    className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={() => setCreateShowModal(false)}
                  >
                    Đóng
                  </button>
                  <Button
                    className="flex h-10 w-[100px] items-center justify-center text-sm"
                    variant="gradient"
                    fullWidth
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting || isCreateUserLoading}
                  >
                    Thêm
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </>
  );
};
