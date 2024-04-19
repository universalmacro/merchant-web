import React from "react";

// Admin Imports
import SystemTables from "views/admin/system";
import OrderTables from "views/admin/order";
import SpaceTable from "views/order/tables";
import MenuTable from "views/menu/tables";
import BillTable from "views/menu/bills";
import SpaceFood from "views/order/food";
import SpaceCategory from "views/order/category";
import SpacePrinter from "views/order/printer";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import { MdBarChart, MdLock, MdOutlineRestaurant, MdOutlineTableBar } from "react-icons/md";
import { FaShareNodes } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";

import {
  LaptopOutlined,
  ProfileOutlined,
  TableOutlined,
  AppstoreOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

const routes = [
  {
    name: "系统管理",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "manage",
    component: <SystemTables />,
  },
  {
    name: "系统点餐",
    layout: "/admin",
    icon: <MdOutlineRestaurant className="h-6 w-6" />,
    path: "order",
    component: <OrderTables />,
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
        name: "餐桌",
        layout: "/spaces",
        icon: <TableOutlined />,
        path: "table",
        component: <SpaceTable />,
        secondary: true,
      },
      {
        name: "品項",
        layout: "/spaces",
        icon: <TableOutlined />,
        path: "food",
        component: <SpaceFood />,
        secondary: true,
      },
      {
        name: "分類",
        layout: "/spaces",
        icon: <AppstoreOutlined />,
        path: "category",
        component: <SpaceCategory />,
        secondary: true,
      },
      {
        name: "打印機",
        layout: "/spaces",
        icon: <PrinterOutlined />,
        path: "printer",
        component: <SpacePrinter />,
        secondary: true,
      },
    ],
  },
];

const orderRoutes: Array<{
  name: string;
  key: string;
  icon: any;
  children?: RoutesType[];
  component?: any;
  path?: string;
}> = [
  {
    name: "選擇餐桌",
    icon: <MdOutlineTableBar />,
    path: "table",
    key: "table",
    component: <MenuTable />,
  },
  {
    name: "所有訂單",
    icon: <TableOutlined />,
    path: "bill",
    key: "bill",
    component: <BillTable />,
  },
];

export default routes;

export { spaceRoutes, orderRoutes };
