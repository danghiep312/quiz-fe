import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tooltip,
  Button,
  Rating,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { projectsData } from "@/data";
import { useExams } from "../../exam/exam.queries";

export const Contest = () => {
  const { data: examsTableData, isLoading } = useExams();
  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full">
          <img src="/img/bg-exam.png" alt="" width={2000} height={350} />
        </div>
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4">
        <CardBody className="p-4">
          <div className="px-4 pb-4">
            <Typography variant="h2" color="blue-gray" className="mb-2">
              Danh sách đề thi
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {examsTableData &&
                examsTableData?.items?.map(
                  ({
                    id,
                    name,
                    description,
                    imageUrl,
                    coverUrl,
                    priority,
                    rate,
                    slug,
                    status,
                    totalTime,
                    startTime,
                    endTime,
                  }) => (
                    <Card key={id} color="transparent" shadow={false}>
                      <CardHeader
                        floated={false}
                        color="gray"
                        className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                      >
                        <img
                          src={imageUrl}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      </CardHeader>
                      <CardBody className="py-0 px-1">
                        <Typography
                          variant="small"
                          className="font-normal text-blue-gray-500"
                        >
                          {name}
                        </Typography>
                        <Typography
                          variant="h5"
                          color="blue-gray"
                          className="mt-1 mb-2"
                        >
                          {name}
                        </Typography>
                        <Typography
                          variant="small"
                          className="font-normal text-blue-gray-500"
                        >
                          {description}
                        </Typography>
                        <div className="flex items-center py-2">
                          <span className="pr-2 font-medium text-black">
                            Độ khó:{" "}
                          </span>{" "}
                          <Rating value={rate} readonly />
                        </div>
                      </CardBody>
                      <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                        <Link to={id}>
                          <Button variant="outlined" size="sm">
                            Vào thi
                          </Button>
                        </Link>
                        <div>
                          {projectsData[0].members.map(({ img, name }, key) => (
                            <Tooltip key={name} content={name}>
                              <Avatar
                                src={img}
                                alt={name}
                                size="xs"
                                variant="circular"
                                className={`cursor-pointer border-2 border-white ${
                                  key === 0 ? "" : "-ml-2.5"
                                }`}
                              />
                            </Tooltip>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  )
                )}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

export default Contest;
