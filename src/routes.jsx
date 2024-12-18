import {
  HomeIcon,
  UserCircleIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile } from "@/pages/dashboard";
import { Exam } from "@/pages/exam";
import { User } from "@/pages/user";
import { Question } from "@/pages/question";
import { Contest, ContestDetail } from "@/pages/client";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "client",
    pages: [
      {
        icon: <BookOpenIcon {...icon} />,
        name: "Contest",
        path: "/contest",
        element: <Contest />,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "Contest Detail",
        path: "/contest/:contestId",
        element: <ContestDetail />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Profile",
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "Home",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "User",
        path: "/user",
        element: <User />,
      },
      {
        icon: <PencilIcon {...icon} />,
        name: "Exam",
        path: "/exam",
        element: <Exam />,
      },
      {
        icon: <QuestionMarkCircleIcon {...icon} />,
        name: "Question",
        path: "/question",
        element: <Question />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "Profile",
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
];

export default routes;
