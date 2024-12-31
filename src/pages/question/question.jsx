import { useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
  Tooltip,
} from "@material-tailwind/react";
import { useQuestions } from "./question.queries";
import { formatDateTime } from "../../helpers/utils";
import { PencilIcon } from "@heroicons/react/24/solid";
import { DeleteDialog } from "./questionDeleteDialog";
import { ALPHABET, QuestionsType } from "./question.constant";
import { QuestionCreateModal } from "./questionCreateModal";
import { QuestionUpdateModal } from "./questionUpdateModal";
import LatexPreview from "@/widgets/draws/latex-preview";
import MathContent from "@/widgets/draws/math-content";


export const Question = () => {
  const { data: questionsTableData, isLoading } = useQuestions();
  const [showQuestionCreateModal, setShowQuestionCreateModal] = useState(false);
  const [showQuestionUpdateModal, setShowQuestionUpdateModal] = useState(false);
  const [updateId, setUpdateId] = useState(null);

  return (
    <>
      {showQuestionCreateModal && (
        <QuestionCreateModal
          isShow={showQuestionCreateModal}
          setShowQuestionCreateModal={setShowQuestionCreateModal}
        />
      )}
      {showQuestionUpdateModal && (
        <QuestionUpdateModal
          isShow={showQuestionUpdateModal}
          setShowQuestionUpdateModal={setShowQuestionUpdateModal}
          questionId={updateId}
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
              Danh sách câu hỏi
            </Typography>
            <Typography variant="h6" color="white">
              <Button
                variant="gradient"
                fullWidth
                className="bg-add-custom"
                onClick={() => setShowQuestionCreateModal(true)}
              >
                Thêm câu hỏi
              </Button>
            </Typography>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {[
                    "Tiêu đề câu hỏi",
                    "Nội dung câu hỏi",
                    "Danh sách đáp án",
                    "Ngày tạo",
                    "Trạng thái",
                    "Hành động",
                  ].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-5"
                    >
                      <Typography className="text-[11px] text-sm uppercase text-black">
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!isLoading &&
                  questionsTableData?.items?.map(
                    (
                      {
                        id,
                        title,
                        question,
                        results,
                        answerText,
                        questionType,
                        status,
                        createdAt,
                      },
                      key
                    ) => {
                      const className = `py-3 px-5 text-center text-sm ${
                        key === questionsTableData.items.length - 1
                          ? ""
                          : "border-b border-blue-gray-50"
                      }`;

                      return (
                        <tr key={id}>
                          <td className={className + " max-w-[300px]"}>
                            <Typography
                              color="blue-gray"
                              className="text-justify  text-sm"
                            >
                              {title}
                            </Typography>
                          </td>
                          <td className={className + " max-w-[300px]"}>
                            <Typography className="text-justify text-sm  text-blue-gray-600">
                              <MathContent content={question}></MathContent>
                            </Typography>
                          </td>
                          <td className={className}>
                            {/* {results.map((answer, index) => {
                              return (
                                <div className="block" key={answer.answerUid}>
                                  <Tooltip
                                    content={
                                      answer.isTrue
                                        ? "This is a correct answer"
                                        : "This is a wrong answer"
                                    }
                                    className={
                                      answer.isTrue
                                        ? "bg-green-400"
                                        : "bg-red-400"
                                    }
                                    placement="right"
                                  >
                                    <Button
                                      className={`mt-4 w-full ${
                                        answer.isTrue
                                          ? " bg-blue-500"
                                          : " bg-gray-600"
                                      } `}
                                    >
                                      <Typography
                                        key={answer.answerUid}
                                        className={
                                          "mt-1 text-left text-xs text-white"
                                        }
                                      >
                                        <span className="font-semibold">
                                          {ALPHABET[index]}.
                                        </span>{" "}
                                        {answer.content}
                                      </Typography>
                                    </Button>
                                  </Tooltip>
                                </div>
                              );
                            })} */}

                            {questionType === QuestionsType.MUTIPLE_CHOICE ? (
                              results.map((answer, index) => (
                                <div className="block" key={answer.answerUid}>
                                  <Tooltip
                                    content={
                                      answer.isTrue
                                        ? "This is a correct answer"
                                        : "This is a wrong answer"
                                    }
                                    className={
                                      answer.isTrue
                                        ? "bg-green-400"
                                        : "bg-red-400"
                                    }
                                    placement="right"
                                  >
                                    <Button
                                      className={`mt-4 w-full ${
                                        answer.isTrue
                                          ? " bg-blue-500"
                                          : " bg-gray-600"
                                      } `}
                                    >
                                      <Typography
                                        key={answer.answerUid}
                                        className={
                                          "mt-1 text-left text-xs text-white"
                                        }
                                      >
                                        <span className="font-semibold" style={{textTransform: "none"}}>  
                                          {ALPHABET[index]}. <MathContent content={answer.content}/>
                                        
                                        </span>
                                        {/* {answer.content} */}
                                      </Typography>
                                    </Button>
                                  </Tooltip>
                                </div>
                              ))
                            ) : (
                              <div className="latex-answer">
                                <LatexPreview latexString={answerText}/>
                              </div>
                            )}
                          </td>
                          <td className={className}>
                            <Typography className="text-sm text-blue-gray-600">
                              {createdAt ? formatDateTime(createdAt) : "-"}
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
                            <div className="flex items-center justify-center">
                              <Typography
                                as="a"
                                href="#"
                                className="mr-2 text-xs font-semibold text-red-600"
                              >
                                <PencilIcon
                                  className="h-5 w-5 cursor-pointer"
                                  onClick={() => {
                                    setShowQuestionUpdateModal(true);
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
    </>
  );
};

export default Question;
