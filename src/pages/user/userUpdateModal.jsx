import _ from "lodash";
import { useReadUser, useUpdateUser } from "./user.queries";
import { Button } from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { EMessage } from "./user.constant";
import { phoneRegex, emailRegex, userNameRegex } from "../auth/auth.constant";

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
  return validates;
};

export const UserUpdateModal = ({ userId, userInfo, setUpdateShowModal }) => {
  const { mutateAsync: updateUser, isLoading: isUpdateUserLoading } =
    useUpdateUser(userId);

  const saveUser = () => {
    updateUser(values, {
      onSuccess: (response) => {
        if (response.id) {
          setUpdateShowModal(false);
          Swal.fire({
            position: "center",
            icon: "success",
            text: "Dữ liệu đã được cập nhật",
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
          title: "Dữ liệu chưa được cập nhật.",
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  };

  const { values, errors, handleSubmit, handleChange } = useFormik({
    initialValues: {
      name: userInfo.name,
      userName: userInfo.userName,
      imageUrl: userInfo.imageUrl,
      email: userInfo.email,
      phoneNumber: userInfo.phoneNumber,
    },
    enableReinitialize: true,
    validate: validator,
    onSubmit: () => {
      saveUser();
    },
  });

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
        <div className="relative my-6 mx-auto w-auto max-w-3xl">
          {/*content*/}
          <div className="relative flex w-full min-w-[768px] flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
            {/*header*/}
            <div className="border-slate-200 flex items-start justify-between rounded-t border-b border-solid p-5">
              <h3 className="text-xl font-semibold">Cập nhật người dùng</h3>
              <button
                className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                onClick={() => setUpdateShowModal(false)}
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
                        value={values.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <span role="alert" className="text-xs text-red-500">
                          {errors.name}
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
                        value={values.userName}
                        onChange={handleChange}
                      />
                      {errors.userName && (
                        <span role="alert" className="text-xs text-red-500">
                          {errors.userName}
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
                        value={values.imageUrl}
                        onChange={handleChange}
                      />
                      {errors.imageUrl && (
                        <span role="alert" className="text-xs text-red-500">
                          {errors.imageUrl}
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
                        value={values.phoneNumber}
                        onChange={handleChange}
                      />
                      {errors.phoneNumber && (
                        <span role="alert" className="text-xs text-red-500">
                          {errors.phoneNumber}
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
                        value={values.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <span role="alert" className="text-xs text-red-500">
                          {errors.email}
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
                onClick={() => setUpdateShowModal(false)}
              >
                Đóng
              </button>
              <Button
                className="flex h-10 w-[120px] items-center justify-center text-sm"
                variant="gradient"
                fullWidth
                onClick={() => handleSubmit()}
                disabled={isUpdateUserLoading || !_.isEmpty(errors)}
              >
                Cập nhật
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
};

export const UpdateModal = ({ isShow, setUpdateShowModal, userId }) => {
  const { data: userInfo, isLoading: isReadExamLoading } = useReadUser(userId);

  return (
    isShow &&
    !isReadExamLoading && (
      <UserUpdateModal
        userId={userId}
        setUpdateShowModal={setUpdateShowModal}
        userInfo={userInfo}
      />
    )
  );
};
