import _ from "lodash";
import { useState, useEffect, useMemo } from "react";
import {
  Button,
  Switch,
  Card,
  CardHeader,
  Input,
  Typography,
  CardBody,
  Chip,
  CardFooter,
  Checkbox,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TABLE_HEAD, rowsPerPageDefault } from "./exam.constants";
import { useReadExam, useUpdateExam } from "./exam.queries";
import { useQuestions } from "../question/question.queries";

const validator = (data) => {
  const validates = {};
  const message = "Thông tin này là bắt buộc. Vui lòng nhập đầy đủ.";
  for (const key in data) {
    if (!data[key] && key !== "status") {
      validates[key] = message;
    }
  }
  const { totalTime } = data;
  if (totalTime <= 0) {
    validates.totalTime = "Thời gian làm bài không hợp lệ";
  }
  return validates;
};

export const ExamUpdateModal = ({ examId, setUpdateShowModal, isShow }) => {
  const { data, isLoading: isReadExamLoading } = useReadExam(examId);
  const { data: questions, isLoadingQuestions } = useQuestions();
  const [examInfo, setExamInfo] = useState({});

  const [questionsTableData, setQuestionsTableData] = useState([]);
  const [totalQuestion, setTotalQuestion] = useState(0);

  const [checked, setChecked] = useState(true);

  const [questionSelect, setQuestionSelect] = useState([]);
  const [currentPage, setCurrentPerPage] = useState(1);

  const handleChangeStatus = (event) => {
    setChecked(event.target.checked);
  };

  useEffect(() => {
    if (data) {
      setExamInfo(data.examInfo);
      setQuestionSelect(data.questions.map((question) => question.id));
    }
  }, [data]);

  const tableRows = useMemo(() => {
    const lastIndex = currentPage * rowsPerPageDefault;
    const firstIndex = lastIndex - rowsPerPageDefault;
    return questionsTableData?.slice(firstIndex, lastIndex);
  }, [currentPage, questionsTableData, rowsPerPageDefault]);

  const handleChangeCheckbox = (id) => {
    if (questionSelect.includes(id)) {
      return setQuestionSelect(questionSelect.filter((t) => t != id));
    }
    questionSelect.push(id);
    setQuestionSelect([...new Set(questionSelect)]);
  };

  useEffect(() => {
    if (questions) {
      setQuestionsTableData(questions.items);
      setTotalQuestion(questions.headers["x-total-count"]);
    }
  }, [questions]);

  const { mutateAsync: updateExam, isLoading: isUpdateExamLoading } =
    useUpdateExam(examId);

  const saveExam = () => {
    updateExam(
      {
        ...values,
        priority: +values.priority,
        rate: +values.rate,
        status: checked ? "PUBLIC" : "PRIVATE",
        questionIds: questionSelect,
      },
      {
        onSuccess: (response) => {
          const fireMessage = {
            icon: "success",
            text: "Dữ liệu đã được cập nhật",
            showConfirmButton: false,
            timer: 1500,
          };
          if (response.id) {
            setUpdateShowModal(false);
          } else {
            fireMessage.icon = "error";
            fireMessage.text = response.message;
          }
          Swal.fire(fireMessage);
        },
        onError: () => {
          Swal.fire({
            icon: "error",
            title: "Dữ liệu chưa được cập nhật.",
            showConfirmButton: false,
            timer: 1500,
          });
        },
      }
    );
  };

  const { values, errors, handleSubmit, handleChange } = useFormik({
    initialValues: {
      name: examInfo.name,
      description: examInfo.description,
      imageUrl: examInfo.imageUrl,
      coverUrl: examInfo.coverUrl,
      totalTime: examInfo.totalTime,
      priority: examInfo.priority,
      rate: examInfo.rate,
      status: examInfo.status,
    },
    enableReinitialize: true,
    validate: validator,
    onSubmit: () => {
      saveExam();
    },
  });

  return (
    isShow && (
      <>
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
          <Card className="h-5/6 overflow-y-auto overflow-x-hidden">
            <div className="relative my-6 mx-auto w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full min-w-[768px] flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="border-slate-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                  <h3 className="text-xl font-semibold">Cập nhật đề thi</h3>
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
                            Tên đề thi
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
                              {errors.name.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="description"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Mô tả
                          </label>
                          <input
                            type="text"
                            className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                            name="description"
                            value={values.description}
                            onChange={handleChange}
                          />
                          {errors.description && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.description.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="imageUrl"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Ảnh
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
                              {errors.imageUrl.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="coverUrl"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Ảnh bìa
                          </label>
                          <input
                            type="text"
                            className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                            name="coverUrl"
                            value={values.coverUrl}
                            onChange={handleChange}
                          />
                          {errors.coverUrl && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.coverUrl.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="totalTime"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Thời gian làm bài
                          </label>
                          <input
                            type="text"
                            className="w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                            name="totalTime"
                            value={values.totalTime}
                            onChange={handleChange}
                          />
                          {errors.totalTime && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.totalTime.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="priority"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Thứ tự ưu tiên
                          </label>
                          <input
                            type="text"
                            className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                            name="priority"
                            value={values.priority}
                            onChange={handleChange}
                          />
                          {errors.priority && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.priority.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="rate"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Độ khó
                          </label>
                          <input
                            type="text"
                            className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                            name="rate"
                            value={values.rate}
                            onChange={handleChange}
                          />
                          {errors.rate && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.rate.message}
                            </span>
                          )}
                        </div>

                        <div className="mb-4 flex items-center">
                          <label
                            htmlFor="status"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Trạng thái
                          </label>
                          <div className="ml-8">
                            <Switch
                              label={checked ? "PUBLIC" : "PRIVATE"}
                              onChange={handleChangeStatus}
                              checked={checked}
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <Card className="h-full w-full">
                            <CardHeader
                              floated={false}
                              shadow={false}
                              className="rounded-none"
                            >
                              <div className="mb-3 flex items-center justify-between gap-8">
                                <div>
                                  <Typography variant="h6" color="blue-gray">
                                    Danh sách câu hỏi
                                  </Typography>
                                </div>
                                {/* <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                    <Button
                                      className="flex items-center gap-3 text-base"
                                      color="blue"
                                      size="md"
                                    >
                                      Lưu lại
                                      {""}
                                      <CheckCircleIcon className="h-6 w-6" />
                                    </Button>
                                  </div> */}
                              </div>
                              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                <div className="w-full">
                                  <Input
                                    label="Tìm kiếm"
                                    icon={
                                      <MagnifyingGlassIcon className="h-5 w-5" />
                                    }
                                  />
                                </div>
                              </div>
                            </CardHeader>
                            <CardBody className="px-0">
                              <table className="w-full min-w-max table-auto text-left">
                                <thead>
                                  <tr>
                                    {TABLE_HEAD.map((head) => (
                                      <th
                                        key={head}
                                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 text-center"
                                      >
                                        <Typography
                                          variant="small"
                                          color="blue-gray"
                                          className="font-normal leading-none opacity-70"
                                        >
                                          {head}
                                        </Typography>
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {!isReadExamLoading &&
                                    tableRows &&
                                    tableRows.map(
                                      ({ id, title, status }, index) => {
                                        const isLast =
                                          index === tableRows.length - 1;
                                        const classes = isLast
                                          ? "p-4 text-center"
                                          : "p-4 border-b border-blue-gray-50 text-center";

                                        return (
                                          <tr key={title}>
                                            <td
                                              className={classes + " w-[6px]"}
                                            >
                                              {index + 1}
                                            </td>
                                            <td
                                              className={
                                                classes + " max-w-[200px]"
                                              }
                                            >
                                              <div className="flex items-center justify-center gap-3">
                                                <div className="flex flex-col">
                                                  <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="text-justify font-normal"
                                                  >
                                                    {title}
                                                  </Typography>
                                                </div>
                                              </div>
                                            </td>
                                            <td className={classes}>
                                              <Chip
                                                variant="gradient"
                                                color={
                                                  status === "ACTIVE"
                                                    ? "green"
                                                    : "blue-gray"
                                                }
                                                value={status}
                                                className="flex justify-center py-0.5 px-2 text-[11px] font-medium"
                                              />
                                            </td>
                                            <td className={classes}>
                                              <Checkbox
                                                id="vertical-list-react"
                                                ripple={false}
                                                className="hover:before:opacity-0"
                                                containerProps={{
                                                  className: "p-0",
                                                }}
                                                checked={questionSelect.includes(
                                                  id
                                                )}
                                                onChange={() =>
                                                  handleChangeCheckbox(id)
                                                }
                                              />
                                            </td>
                                          </tr>
                                        );
                                      }
                                    )}
                                </tbody>
                              </table>
                            </CardBody>
                            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                              <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                Trang {currentPage} trên{" "}
                                {Math.ceil(totalQuestion / rowsPerPageDefault)}
                              </Typography>
                              <div className="flex gap-2">
                                <Button
                                  variant="outlined"
                                  color="blue-gray"
                                  size="sm"
                                  disabled={currentPage <= 1}
                                  onClick={() =>
                                    setCurrentPerPage(
                                      (currentPage) => currentPage - 1
                                    )
                                  }
                                >
                                  Trước
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="blue-gray"
                                  size="sm"
                                  onClick={() =>
                                    setCurrentPerPage(
                                      (currentPage) => currentPage + 1
                                    )
                                  }
                                  disabled={
                                    currentPage * rowsPerPageDefault >
                                    totalQuestion
                                  }
                                >
                                  Tiếp
                                </Button>
                              </div>
                            </CardFooter>
                          </Card>
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
                    disabled={isUpdateExamLoading || !_.isEmpty(errors)}
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
      </>
    )
  );
};
