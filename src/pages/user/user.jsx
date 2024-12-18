import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
} from "@material-tailwind/react";
import { useUsers } from "./user.queries";
import { formatDateTime } from "../../helpers/utils";
import { PencilIcon } from "@heroicons/react/24/solid";
import { DeleteDialog } from "./userDeleteDialog";
import { CreateModal } from "./userCreateModal";
import { UpdateModal } from "./userUpdateModal";

export const User = () => {
  const { data: usersTableData, isLoading } = useUsers();
  const [showCreateModal, setCreateShowModal] = useState(false);
  const [showUpdateModal, setUpdateShowModal] = useState(false);
  const [updateUserId, setUpdateUserId] = useState(null);

  return (
    <>
      {showCreateModal && (
        <CreateModal
          isShow={showCreateModal}
          setCreateShowModal={setCreateShowModal}
        />
      )}
      {showUpdateModal && (
        <UpdateModal
          isShow={showUpdateModal}
          setUpdateShowModal={setUpdateShowModal}
          userId={updateUserId}
        />
      )}
      <div className="mt-12 mb-8 flex flex-col gap-12">
        <Card>
          <CardHeader
            variant="gradient"
            color="blue"
            className="mb-8 flex justify-between p-6"
          >
            <Typography variant="h4" color="white">
              Danh sách người dùng
            </Typography>
            <Typography variant="h6" color="white">
              <Button
                variant="gradient"
                fullWidth
                className="bg-add-custom"
                onClick={() => setCreateShowModal(true)}
              >
                Thêm người dùng
              </Button>
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "Tài khoản",
                    "Họ tên",
                    "Số điện thoại",
                    "Trạng thái",
                    "Đăng nhập gần đây",
                    "Hành động",
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersTableData &&
                  usersTableData?.items?.map(
                    (
                      {
                        id,
                        userName,
                        name,
                        phoneNumber,
                        imageUrl,
                        email,
                        status,
                        lastLoginAt,
                      },
                      key
                    ) => {
                      const className = `py-3 px-5 ${
                        key === usersTableData.items.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

                      return (
                        <tr key={id}>
                          <td className={className}>
                            <div className="flex items-center gap-4">
                              <Avatar src={imageUrl} alt={name} size="sm" />
                              <div>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-semibold"
                                >
                                  {userName}
                                </Typography>
                                <Typography className="text-xs font-normal text-blue-gray-500">
                                  {email}
                                </Typography>
                              </div>
                            </div>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {name}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {phoneNumber}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Chip
                              variant="gradient"
                              color={
                                status === "ACTIVE" ? "green" : "blue-gray"
                              }
                              value={status}
                              className="py-0.5 px-2 text-[11px] font-medium"
                            />
                          </td>
                          <td className={className}>
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {lastLoginAt ? formatDateTime(lastLoginAt) : "-"}
                            </Typography>
                          </td>
                          <td
                            className={
                              className + " flex items-center justify-start"
                            }
                          >
                            <Typography className="mr-2 text-xs font-semibold text-red-600">
                              <PencilIcon
                                className="h-5 w-5 cursor-pointer"
                                onClick={() => {
                                  setUpdateShowModal(true);
                                  setUpdateUserId(id);
                                }}
                              />
                            </Typography>

                            <DeleteDialog id={id} />
                          </td>
                        </tr>
                      );
                    }
                  )}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default User;
