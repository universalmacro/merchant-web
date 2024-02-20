import React from "react";

// Admin Imports
import SystemTables from "views/admin/system";
import AdminTables from "views/admin/manage";
import NodeTables from "views/admin/nodes";
import Profile from "views/admin/profile";
import SpaceTable from "views/order/tables";
import SpaceFood from "views/order/food";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import { MdBarChart, MdLock, MdPeopleAlt } from "react-icons/md";
import { FaShareNodes } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

import { LaptopOutlined, ProfileOutlined, TableOutlined } from "@ant-design/icons";

const routes = [
  {
    name: "系统管理",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "manage",
    component: <SystemTables />,
  },
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    hidden: true,
    component: <SignIn />,
  },
];

const spaceRoutes: Array<{
  name: string;
  key: string;
  icon: any;
  children?: RoutesType[];
  component?: any;
  path?: string;
}> = [
  {
    name: "空間詳情",
    key: "detail",
    icon: <ProfileOutlined />,
    component: <></>,
    path: "detail",
  },

  {
    name: "配置",
    icon: <LaptopOutlined />,
    key: "order",
    children: [
      {
        name: "table",
        layout: "/spaces",
        icon: <TableOutlined />,
        path: "table",
        component: <SpaceTable />,
        secondary: true,
      },
      {
        name: "food",
        layout: "/spaces",
        icon: <TableOutlined />,
        path: "food",
        component: <SpaceFood />,
        secondary: true,
      },
    ],
  },
];
export default routes;

export { spaceRoutes };
