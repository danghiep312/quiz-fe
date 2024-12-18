import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Rating,
  Spinner,
} from "@material-tailwind/react";
import { useExams } from "./exam.queries";
import { PencilIcon, EyeIcon } from "@heroicons/react/24/solid";
import { DeleteDialog } from "./examDeleteDialog";
import { ExamCreateModal } from "./examCreateModal";
import { ExamUpdateModal } from "./examUpdateModal";

export const Exam = () => {
  const { data: examsTableData, isLoading } = useExams();
  const [showExamCreateModal, setShowExamCreateModal] = useState(false);
  const [showUpdateModal, setUpdateShowModal] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  return (
    <>
      {showExamCreateModal && (
        <ExamCreateModal
          isShow={showExamCreateModal}
          setShowExamCreateModal={setShowExamCreateModal}
        />
      )}
      {showUpdateModal && (
        <ExamUpdateModal
          isShow={showUpdateModal}
          setUpdateShowModal={setUpdateShowModal}
          examId={updateId}
        />
      )}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-transparent outline-none focus:outline-none">
          <Spinner />
        </div>
      )}

      {!isLoading && (
        <div className="mt-12 mb-8 flex flex-col gap-12">
          <Card>
            <CardHeader
              variant="gradient"
              color="blue"
              className="mb-8 flex justify-between p-6"
            >
              <Typography variant="h4" color="white">
                Danh sách đề thi
              </Typography>
              <Typography variant="h6" color="white">
                <Button
                  variant="gradient"
                  fullWidth
                  className="bg-add-custom"
                  onClick={() => setShowExamCreateModal(true)}
                >
                  Thêm đề thi
                </Button>
              </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {[
                      "Thông tin chung bài thi",
                      "Thứ tự ưu tiên",
                      "Độ khó",
                      "Thời gian làm bài",
                      "Số lượt xem",
                      "Trạng thái",
                      "Hành động",
                    ].map((el) => (
                      <th
                        key={el}
                        className="border-b border-blue-gray-50 py-3 px-5"
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
                  {examsTableData &&
                    examsTableData?.items?.map(
                      (
                        {
                          id,
                          name,
                          description,
                          coverUrl,
                          priority,
                          rate,
                          slug,
                          status,
                          totalTime,
                          totalView,
                        },
                        key
                      ) => {
                        const className = `py-3 px-5 ${
                          key === examsTableData.items.length - 1
                            ? ""
                            : "border-b border-blue-gray-50"
                        }`;

                        return (
                          <tr key={id}>
                            <td className={className + " max-w-[350px]"}>
                              <div className="flex items-center gap-4">
                                <Avatar
                                  src={coverUrl}
                                  alt={name}
                                  size="xxl"
                                  variant="rounded"
                                  withBorder={true}
                                  color="light-blue"
                                  className="p-0.5"
                                />
                                <div>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-semibold"
                                  >
                                    {name}
                                  </Typography>
                                  <Typography className="mt-2 text-xs font-normal text-blue-gray-500">
                                    <span className="blue-gray font-semibold">
                                      Đường dẫn:
                                    </span>{" "}
                                    {slug}
                                  </Typography>
                                  <Typography className="mt-2 text-xs font-normal text-blue-gray-500">
                                    <span className="blue-gray font-semibold">
                                      Mô tả chung:
                                    </span>{" "}
                                    {description}
                                  </Typography>
                                </div>
                              </div>
                            </td>
                            <td className={className + " text-center"}>
                              <Typography className="text-xs font-semibold text-blue-gray-600">
                                {priority}
                              </Typography>
                            </td>
                            <td className={className + " text-center"}>
                              <Rating value={rate || 5} readonly />
                            </td>
                            <td className={className + " text-center"}>
                              <Typography className="text-xs font-semibold text-blue-gray-600">
                                {totalTime}{" "}
                                <span className="blue-gray font-semibold">
                                  phút
                                </span>
                              </Typography>
                            </td>
                            <td className={className + " text-center"}>
                              <div className="flex items-center justify-center text-xs font-semibold text-blue-gray-600">
                                {totalView}
                                <EyeIcon className="ml-1 h-4 w-4" />
                              </div>
                            </td>
                            <td className={className + " text-center"}>
                              <Chip
                                variant="gradient"
                                color={
                                  status === "PUBLIC" ? "green" : "blue-gray"
                                }
                                value={status}
                                className="py-0.5 px-2 text-[11px] font-medium"
                              />
                            </td>
                            <td className={className}>
                              <div className="flex items-center justify-center">
                                <Typography
                                  as="a"
                                  href="#"
                                  className="mr-2 text-xs font-semibold text-red-600"
                                >
                                  <PencilIcon
                                    className="h-5 w-5 cursor-pointer"
                                    onClick={() => {
                                      setUpdateShowModal(true);
                                      setUpdateId(id);
                                    }}
                                  />
                                </Typography>
                                <DeleteDialog id={id} />
                              </div>
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
      )}
    </>
  );
};

export default Exam;
