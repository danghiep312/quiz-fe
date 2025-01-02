import _ from "lodash";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Spinner,
  List,
  ListItem,
  ListItemPrefix,
  Checkbox,
  Alert,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Badge,
} from "@material-tailwind/react";
import { BellIcon } from "@heroicons/react/24/solid";
import { useReadExam, useSubmitExam } from "../../exam/exam.queries";
import { CollapseComponent } from "../../../components/Collapse/CollapseComponent";
import Swal from "sweetalert2";
import { QuestionsType } from "@/pages/question/question.constant";
import LatexPreview from "@/widgets/draws/latex-preview";
import DrawingBoard from "@/widgets/draws/drawing-board";
import FileUploadComponent from "@/widgets/draws/file-upload-with-preview";
import { convertFileToBase64, getLatexByApi } from "@/helpers";
import MathContent from "@/widgets/draws/math-content";

export const ContestDetail = () => {
  const params = useParams();
  const { data: response, isLoading: isReadExamLoading } = useReadExam(
    params.contestId
  );

  const [isSubmitContest, setIsSubmitContest] = useState(false);
  const [selectQuestion, setSelectQuestion] = useState(null);
  const [selectQuestionId, setSelectQuestionId] = useState(1);

  const [result, setResult] = useState({});
  const [open, setOpen] = useState(false);
  const [openConfirmRetry, setOpenConfirmRetry] = useState(false);

  const handleOpen = () => setOpen(!open);
  const handleOpenConfirmRetry = () => setOpenConfirmRetry(!openConfirmRetry);

  const [yourAnswers, setYourAnswer] = useState({
    contestId: params.contestId,
    answers: {},
    answersText: {},
  });

  const onImageUploaded = async (file) => {
    let base64image = await convertFileToBase64(file);
    let latexResult = await getLatexByApi(base64image);

    yourAnswers.answersText[selectQuestion.id] = latexResult;
  };

  const getLatexString = async (imageData) => {
    let latexResult = await getLatexByApi(imageData);

    yourAnswers.answersText[selectQuestion.id] = latexResult;
  };

  const handleSubmitContest = () => {
    setOpen(false);
    submitExam(yourAnswers, {
      onSuccess: (response) => {
        setIsSubmitContest(true);
        setResult(response);
        Swal.fire({
          position: "center",
          icon: "success",
          text: response.message,
          showConfirmButton: false,
          timer: 2000,
        });
      },
      onError: () => {
        Swal.fire({
          icon: "error",
          title: "System Error!",
          showConfirmButton: false,
          timer: 1500,
        });
      },
    });
  };

  const { mutateAsync: submitExam, isLoading: isSubmitExamLoading } =
    useSubmitExam();

  const handleSelectQuestion = (questionId) => {
    const findQuestion = response?.questions?.find(
      (question) => question.id === questionId
    );
    setSelectQuestion(findQuestion || {});
  };

  const handleChangeAnswers = (e) => {
    const { value, checked } = e.target;
    const { answers, contestId } = yourAnswers;
    answers[selectQuestion.id] = answers[selectQuestion.id].map((answer) => {
      return {
        answerUid: answer.answerUid,
        content: answer.content,
        isTrue: answer.answerUid === value ? checked : answer.isTrue,
      };
    });
    setYourAnswer({
      contestId,
      answers,
    });
  };

  useEffect(() => {
    if (
      selectQuestion &&
      yourAnswers.answers &&
      !yourAnswers.answers[selectQuestion.id]
    ) {
      yourAnswers.answers[selectQuestion.id] = selectQuestion?.answers?.map(
        (answer) => {
          return {
            answerUid: answer.answerUid,
            content: answer.content,
            isTrue: false,
          };
        }
      );
    }

    if (
      selectQuestion &&
      yourAnswers.answersText &&
      !yourAnswers.answersText[selectQuestion.id]
    ) {
      yourAnswers.answersText[selectQuestion.id] = "";
    }
  }, [selectQuestion, yourAnswers]);

  return (
    !isReadExamLoading && (
      <>
        <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-cover	bg-center">
          <div className="absolute inset-0 h-full w-full">
            <img src="/img/bg-exam.png" alt="" width={2000} height={350} />
          </div>
        </div>
        <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
          <CardBody className="p-4">
            <div className="px-4 pb-4">
              <div className="grid grid-cols-2">
                <div className="">
                  <Typography variant="h3" color="blue-gray" className="mb-2">
                    {response?.examInfo?.name}
                  </Typography>
                </div>
                <div className="flex justify-end">
                  <Alert
                    color="red"
                    className="justify-center text-lg"
                    variant={isSubmitContest ? "gradient" : "outlined"}
                  >
                    Point: {result.point || 0}/{response?.questions?.length}
                  </Alert>
                  <Alert
                    className="ml-2 justify-center text-lg"
                    variant={isSubmitContest ? "gradient" : "outlined"}
                  >
                    Total time: {response?.examInfo?.totalTime} minutes
                  </Alert>
                </div>
              </div>
              <div className="mt-6">
                <div className="w-full p-2">
                  <h3 className="text-base font-normal text-[#1d1d1d]">
                    Question Palette
                  </h3>
                  <div>
                    <div className="mt-4 flex items-center gap-4">
                      {response?.questions?.map((q, index) => {
                        return (
                          <Badge
                            invisible={!isSubmitContest}
                            color={
                              result.statusResults &&
                              result?.statusResults[q.id]
                                ? "light-blue"
                                : "red"
                            }
                            placement="top-end"
                            key={q.id}
                          >
                            <Button
                              className={`hover:bg-blue-gray-600 ${
                                selectQuestion && q.id === selectQuestion.id
                                  ? "bg-blue-gray-600"
                                  : "bg-blue-gray-200"
                              }`}
                              onClick={() => {
                                handleSelectQuestion(q.id);
                                setSelectQuestionId(index + 1);
                              }}
                            >
                              {index + 1}
                            </Button>
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                  {!selectQuestion && (
                    <Alert color="green" variant="outlined" className="mt-4">
                      <span>Pick a question and get started</span>
                    </Alert>
                  )}
                  {selectQuestion && (
                    <div className="mt-4 p-5">
                      <h1>
                        <strong>Câu {selectQuestionId}. </strong>
                        {/* {selectQuestion.question} */}
                        <MathContent content={selectQuestion.question} />
                      </h1>
                      {selectQuestion.questionType ===
                        QuestionsType.MUTIPLE_CHOICE && (
                        <>
                          <Card className="mt-4">
                            <List>
                              {selectQuestion?.answers?.map((answer) => {
                                return (
                                  <ListItem
                                    className="p-3"
                                    key={answer.answerUid}
                                  >
                                    <label
                                      htmlFor="vertical-list-react"
                                      className="flex w-full cursor-pointer items-center px-3 py-2"
                                    >
                                      <ListItemPrefix className="mr-3">
                                        <Checkbox
                                          key={answer.answerUid}
                                          id="vertical-list-react"
                                          ripple={false}
                                          className="hover:before:opacity-0"
                                          containerProps={{
                                            className: "p-0",
                                          }}
                                          value={answer.answerUid || ""}
                                          checked={yourAnswers.answers[
                                            selectQuestion.id
                                          ]?.some(
                                            (o) =>
                                              o.answerUid ===
                                                answer.answerUid && o.isTrue
                                          )}
                                          onChange={handleChangeAnswers}
                                        />
                                      </ListItemPrefix>
                                      <Typography
                                        color="blue-gray"
                                        className="font-medium"
                                      >
                                        {/* {answer.content} */}
                                        <MathContent content={answer.content} />
                                      </Typography>
                                    </label>
                                  </ListItem>
                                );
                              })}
                            </List>
                          </Card>
                        </>
                      )}

                      {selectQuestion.questionType === QuestionsType.MANUAL && (
                        <>
                          <LatexPreview
                            latexString={
                              yourAnswers.answersText[selectQuestion.id]
                            }
                          />
                          <DrawingBoard previewImage={getLatexString} />
                          <FileUploadComponent
                            onImageChange={onImageUploaded}
                          />
                        </>
                      )}

                      {isSubmitContest && (
                        <div className="mt-5">
                          <CollapseComponent
                            name="Explanation"
                            content={selectQuestion.explaination}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div></div>
              </div>
            </div>
            <div className="my-2 flex justify-center">
              <Button
                size="lg"
                onClick={handleOpenConfirmRetry}
                className="mr-2"
                color="red"
              >
                Try again
              </Button>
              <Button
                size="lg"
                onClick={handleOpen}
                disabled={_.isEmpty(yourAnswers.answers) || isSubmitContest}
                className="flex items-center"
              >
                {isSubmitExamLoading && <Spinner className="mr-2 h-4 w-4" />}
                Submit
              </Button>
            </div>
          </CardBody>
        </Card>

        <Dialog open={open} handler={handleOpen}>
          <DialogHeader className="justify-center">Are you sure?</DialogHeader>
          <DialogBody divider>
            You can continue to edit a practice submitted to a contest up to the
            submission deadline. Once the submission deadline has passed, your
            submission will be locked from editing until the contest period is
            complete! Do you really want to submit?
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleOpen}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
            <Button
              variant="gradient"
              color="green"
              onClick={handleSubmitContest}
            >
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>

        <Dialog open={openConfirmRetry} handler={handleOpenConfirmRetry}>
          <DialogHeader>
            <Typography variant="h5" color="blue-gray">
              Your Attention is Required!
            </Typography>
          </DialogHeader>
          <DialogBody divider className="grid place-items-center gap-4">
            <BellIcon className="h-16 w-16 text-red-500" />
            <Typography color="red" variant="h4">
              You should read this!
            </Typography>
            <Typography className="text-center font-normal">
              By clicking OK you will restart your test and have to do it all
              over again.
            </Typography>
          </DialogBody>
          <DialogFooter className="space-x-2">
            <Button
              variant="text"
              color="blue-gray"
              onClick={handleOpenConfirmRetry}
            >
              Close
            </Button>
            <Button
              variant="gradient"
              onClick={() => {
                handleOpenConfirmRetry();
                window.location.reload();
              }}
            >
              Ok, Got it
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    )
  );
};

export default ContestDetail;
