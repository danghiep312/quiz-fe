import _ from "lodash";
import { useState, useEffect } from "react";
import { useUpdateQuestion, useReadQuestion } from "./question.queries";
import {
  Button,
  Switch,
  Input,
  Checkbox,
  Spinner,
} from "@material-tailwind/react";
import Swal from "sweetalert2";
import { QuestionsStatus, QuestionsType } from "./question.constant";
import { useFormik } from "formik";
import LatexPreview from "@/widgets/draws/latex-preview";
import DrawingBoard from "@/widgets/draws/drawing-board";
import FileUploadComponent from "@/widgets/draws/file-upload-with-preview";
import { convertFileToBase64, getLatexByApi } from "@/helpers";

const validator = (data) => {
  const validates = {};
  const message = "Thông tin này là bắt buộc. Vui lòng nhập đầy đủ.";
  for (const key in data) {
    if (!data[key] && key !== "status") {
      validates[key] = message;
    }
  }
  return validates;
};

export const QuestionUpdateModal = ({
  isShow,
  setShowQuestionUpdateModal,
  questionId,
}) => {
  const [answerText, setAnswerText] = useState("");
  const [questionType, setQuestionType] = useState(
    QuestionsType.MUTIPLE_CHOICE
  );

  const onImageUploaded = async (file) => {
    let base64image = await convertFileToBase64(file);
    let latexResult = await getLatexByApi(base64image);

    setAnswerText(latexResult);
  };

  const { data: response, isLoading: isReadQuestionLoading } =
    useReadQuestion(questionId);

  const [checked, setChecked] = useState(false);

  const [a, setA] = useState({
    answerUid: "",
    content: "",
    isTrue: false,
  });
  const [b, setB] = useState({
    answerUid: "",
    content: "",
    isTrue: false,
  });
  const [c, setC] = useState({
    answerUid: "",
    content: "",
    isTrue: false,
  });
  const [d, setD] = useState({
    answerUid: "",
    content: "",
    isTrue: false,
  });

  const getLatexString = async (imageData) => {
    let latexResult = await getLatexByApi(imageData);

    setAnswerText(latexResult);
  };

  useEffect(() => {
    if (response) {
      setChecked(response.status === QuestionsStatus.ACTIVE ? true : false);
      setA(response.results[0]);
      setB(response.results[1]);
      setC(response.results[2]);
      setD(response.results[3]);
      setQuestionType(response.questionType);
      setAnswerText(response.answerText);
    }
  }, [response]);

  const handleChangeContent = (key, obj) => {
    switch (key) {
      case "a":
        setA({ ...a, ...obj });
        return;
      case "b":
        setB({ ...b, ...obj });
        return;
      case "c":
        setC({ ...c, ...obj });
        return;
      case "d":
        setD({ ...d, ...obj });
        return;
    }
  };

  const handleChangeStatus = (event) => {
    setChecked(event.target.checked);
  };

  const saveQuestion = () => {
    updateQuestion(
      {
        ...values,
        status: checked ? QuestionsStatus.ACTIVE : QuestionsStatus.INACTIVE,
        answers: [a, b, c, d],
      },
      {
        onSuccess: (response) => {
          if (response.id) {
            setShowQuestionUpdateModal(false);
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
              text: response,
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
      }
    );
  };

  const { values, errors, handleSubmit, handleChange } = useFormik({
    initialValues: {
      title: response ? response.title : "",
      code: response ? response.code : "",
      question: response ? response.question : "",
      explanation: response ? response.explanation : "",
      status: checked || false,
      answers: [],
      questionsType: response ? response.questionType : "",
      answerText: response ? response.answerText : "",
    },
    enableReinitialize: true,
    validate: validator,
    onSubmit: () => {
      saveQuestion();
    },
  });

  const { mutateAsync: updateQuestion, isLoading: isUpdateQuestionLoading } =
    useUpdateQuestion(questionId);

  return (
    <>
      {!isShow && <></>}
      {isReadQuestionLoading ||
        (isUpdateQuestionLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-transparent outline-none focus:outline-none">
            <Spinner />
          </div>
        ))}
      {isShow && !isReadQuestionLoading && (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-auto max-w-3xl">
              {/*content*/}
              <div className="relative flex w-full min-w-[768px] flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                {/*header*/}
                <div className="border-slate-200 flex items-start justify-between rounded-t border-b border-solid p-5">
                  <h3 className="text-xl font-semibold">Cập nhật câu hỏi</h3>
                  <button
                    className="float-right ml-auto border-0 bg-transparent p-1 text-3xl font-semibold leading-none text-black opacity-5 outline-none focus:outline-none"
                    onClick={() => setShowQuestionUpdateModal(false)}
                  >
                    <span className="block h-6 w-6 bg-transparent text-2xl text-black opacity-5 outline-none focus:outline-none">
                      x
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative max-h-[800px] flex-auto overflow-y-auto p-6">
                  <form>
                    <section>
                      <div className="mb-1rem">
                        <div className="mb-4">
                          <label
                            htmlFor="title"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Tiêu đề câu hỏi
                          </label>
                          <input
                            type="text"
                            className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                            name="title"
                            value={values.title}
                            onChange={handleChange}
                          />
                          {errors.title && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.title}
                            </span>
                          )}
                        </div>
                        <div className="mb-4">
                          <label
                            htmlFor="code"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Mã câu hỏi
                          </label>
                          <input
                            type="text"
                            className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                            name="code"
                            value={values.code}
                            onChange={handleChange}
                          />
                          {errors.code && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.code}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="question"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Nội dung câu hỏi
                          </label>
                          <input
                            type="text"
                            className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                            name="question"
                            value={values.question}
                            onChange={handleChange}
                          />
                          {errors.question && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.question}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            htmlFor="explanation"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Giải thích
                          </label>
                          <input
                            type="text"
                            className="h-full w-full rounded-md border border-blue-gray-200 bg-transparent px-3 py-3 font-sans text-sm font-normal text-blue-gray-700 focus:border-2 focus:border-blue-500 focus:outline-0"
                            name="explanation"
                            value={values.explanation}
                            onChange={handleChange}
                          />
                          {errors.explanation && (
                            <span role="alert" className="text-xs text-red-500">
                              {errors.explanation}
                            </span>
                          )}
                        </div>

                        <div className="mb-4">
                          <label
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                            htmlFor="questionType"
                          >
                            Loại câu hỏi
                          </label>
                          <div className="flex gap-4">
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="questionType"
                                value="multiple_choice"
                                checked={
                                  questionType === QuestionsType.MUTIPLE_CHOICE
                                }
                                onChange={() =>
                                  setQuestionType(QuestionsType.MUTIPLE_CHOICE)
                                }
                              />
                              <span className="ml-2">Trắc nghiệm</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="radio"
                                name="questionType"
                                value="questionType"
                                checked={questionType === QuestionsType.MANUAL}
                                onChange={() =>
                                  setQuestionType(QuestionsType.MANUAL)
                                }
                              />
                              <span className="ml-2">Điền đáp án</span>
                            </label>
                          </div>
                          <label
                            htmlFor="answers"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Nội dung trả lời
                          </label>
                          {questionType === QuestionsType.MUTIPLE_CHOICE && (
                            <>
                              <div className="mt-4 grid grid-cols-[50px_1fr]">
                                <Checkbox
                                  key="A"
                                  id="vertical-list-react"
                                  ripple={false}
                                  className="hover:before:opacity-0"
                                  containerProps={{
                                    className: "p-0",
                                  }}
                                  checked={a.isTrue}
                                  onChange={() => {
                                    handleChangeContent("a", {
                                      isTrue: !a.isTrue,
                                    });
                                  }}
                                />
                                <Input
                                  size="lg"
                                  label="Đáp án A"
                                  value={a.content}
                                  onChange={(evt) => {
                                    handleChangeContent("a", {
                                      content: evt.target.value,
                                    });
                                  }}
                                />
                                {errors.a && (
                                  <span
                                    role="alert"
                                    className="text-xs text-red-500"
                                  >
                                    {errors.a}
                                  </span>
                                )}
                              </div>
                              <div className="mt-4 grid grid-cols-[50px_1fr]">
                                <Checkbox
                                  key="B"
                                  id="vertical-list-react"
                                  ripple={false}
                                  className="hover:before:opacity-0"
                                  containerProps={{
                                    className: "p-0",
                                  }}
                                  checked={b.isTrue}
                                  onChange={() => {
                                    handleChangeContent("b", {
                                      isTrue: !b.isTrue,
                                    });
                                  }}
                                />
                                <Input
                                  size="lg"
                                  label="Đáp án B"
                                  value={b.content}
                                  onChange={(evt) => {
                                    handleChangeContent("b", {
                                      content: evt.target.value,
                                    });
                                  }}
                                />
                              </div>
                              <div className="mt-4 grid grid-cols-[50px_1fr]">
                                <Checkbox
                                  key="C"
                                  id="vertical-list-react"
                                  ripple={false}
                                  className="hover:before:opacity-0"
                                  containerProps={{
                                    className: "p-0",
                                  }}
                                  checked={c.isTrue}
                                  onChange={() => {
                                    handleChangeContent("c", {
                                      isTrue: !c.isTrue,
                                    });
                                  }}
                                />
                                <Input
                                  size="lg"
                                  label="Đáp án C"
                                  value={c.content}
                                  onChange={(evt) => {
                                    handleChangeContent("c", {
                                      content: evt.target.value,
                                    });
                                  }}
                                />
                              </div>
                              <div className="mt-4 grid grid-cols-[50px_1fr]">
                                <Checkbox
                                  key="D"
                                  id="vertical-list-react"
                                  ripple={false}
                                  className="hover:before:opacity-0"
                                  containerProps={{
                                    className: "p-0",
                                  }}
                                  checked={d.isTrue}
                                  onChange={() => {
                                    handleChangeContent("d", {
                                      isTrue: !d.isTrue,
                                    });
                                  }}
                                />
                                <Input
                                  size="lg"
                                  label="Đáp án D"
                                  value={d.content}
                                  onChange={(evt) => {
                                    handleChangeContent("d", {
                                      content: evt.target.value,
                                    });
                                  }}
                                />
                              </div>
                            </>
                          )}
                          {questionType === QuestionsType.MANUAL && (
                            <div className="mb-4">
                              <label className="text-mediumgrey mb-1 block text-sm leading-5">
                                Câu trả lời
                              </label>
                              <LatexPreview latexString={answerText} />
                              <DrawingBoard previewImage={getLatexString} />
                              <FileUploadComponent
                                onImageChange={onImageUploaded}
                              />
                            </div>
                          )}
                        </div>

                        <div className="my-4 mt-2 flex items-center">
                          <label
                            htmlFor="status"
                            className="text-mediumgrey mb-1 block text-sm leading-5"
                          >
                            Trạng thái
                          </label>
                          <div className="ml-8">
                            <Switch
                              label={
                                checked
                                  ? QuestionsStatus.ACTIVE
                                  : QuestionsStatus.INACTIVE
                              }
                              onChange={handleChangeStatus}
                              checked={checked}
                            />
                          </div>
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
                    onClick={() => setShowQuestionUpdateModal(false)}
                  >
                    Đóng
                  </button>
                  <Button
                    className="flex h-10 w-[150px] items-center justify-center text-sm"
                    variant="gradient"
                    fullWidth
                    onClick={() => handleSubmit()}
                    disabled={isUpdateQuestionLoading || !_.isEmpty(errors)}
                  >
                    Cập nhật
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      )}
    </>
  );
};
