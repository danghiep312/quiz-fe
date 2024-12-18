import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  BellIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const adminRoutes = [
  {
    icon: <HomeIcon {...icon} />,
    name: "Home",
    path: "/home",
  },
  {
    icon: <UserCircleIcon {...icon} />,
    name: "User",
    path: "/user",
  },
  {
    icon: <PencilIcon {...icon} />,
    name: "Exam",
    path: "/exam",
  },
  {
    icon: <QuestionMarkCircleIcon {...icon} />,
    name: "Question",
    path: "/question",
  },
  {
    icon: <UserCircleIcon {...icon} />,
    name: "Profile",
    path: "/profile",
  },
];

export const clientRoutes = [
  {
    icon: <BookOpenIcon {...icon} />,
    name: "Contest",
    path: "/contest",
  },
  {
    icon: <UserCircleIcon {...icon} />,
    name: "Profile",
    path: "/profile",
    element: <Profile />,
  },
];
