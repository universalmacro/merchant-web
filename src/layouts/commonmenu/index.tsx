import React, { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { orderRoutes } from "routes";
import { MenuFoldOutlined, MenuUnfoldOutlined, ShoppingOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme, Button, Drawer, Badge } from "antd";
import Food from "../../views/menu/food";

const { Header, Content, Sider, Footer } = Layout;

const items3: MenuProps["items"] = orderRoutes.map((item, index) => {
  return {
    key: item.key,
    icon: item.icon,
    label: item.name,

    children: item?.children?.map((_, j) => {
      const subKey = _.path;
      return {
        key: subKey,
        label: _.name,
      };
    }),
  };
});

const domain = "/spaces/";
const subPath = "/menu/";

export default function Config(props: { [x: string]: any }) {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const { spaces, userToken, basePath } = useSelector((state: any) => state.auth) || [];

  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [currentRoute, setCurrentRoute] = React.useState("table");
  const [showDrawer, setShowDrawer] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [amount, setAmount] = useState(0);

  const { id } = useParams();
  const [table, setTable] = useState(location?.state?.record);
  const [order, setOrder] = useState(location?.state?.order);

  const getSpaceName = (id: string) => {
    if (!id) return "";
    let name = spaces.filter((item: any) => item.id === id)?.[0]?.name ?? "";
    setSpaceName(name);
  };

  const [breadItems, setBreadItems] = React.useState([
    {
      title: <a href="/">{spaceName}</a>,
    },
    {
      title: <a href={`/spaces/${id}/menu/table`}>{table?.label}</a>,
    },
  ]);

  const onClickMenu = (route: any) => {
    navigate(domain + id + subPath + route.key);
  };

  React.useEffect(() => {
    getActiveRoute(orderRoutes);
    setTable(location?.state?.record);
    setOrder(location?.state?.order);
  }, [location.pathname, location?.state, id]);

  React.useEffect(() => {
    getActiveRoute(orderRoutes);
    setTable(location?.state?.record);
    if (id && basePath && userToken) {
      getSpaceName(id);
    }
  }, [id, basePath, userToken]);

  React.useEffect(() => {
    setBreadItems([
      {
        title: <a href="/">{spaceName}</a>,
      },
      {
        title: <a href={`/spaces/${id}/menu/table`}>{location?.state?.record?.label}</a>,
      },
    ]);
  }, [table, spaceName]);

  const getActiveRoute = (routesConfig: any): string => {
    let activeRoute = "table";
    for (let j = 0; j < routesConfig?.length; j++) {
      if (window.location.href.indexOf("/" + id + subPath + routesConfig?.[j].path) !== -1) {
        setCurrentRoute(routesConfig?.[j].key);
      }
    }
    return activeRoute;
  };

  const getRoutes = (routesConfig: any): any => {
    let routeList = [];
    for (let j = 0; j < routesConfig?.length; j++) {
      if (routesConfig?.[j]?.component) {
        routeList.push(
          <Route
            path={`${routesConfig?.[j].path}`}
            element={routesConfig?.[j].component}
            key={routesConfig?.[j].key}
          />
        );
      } else {
      }
      let routes = routesConfig?.[j].children;
      routeList.push(
        routes?.map((prop: any, key: any) => {
          return <Route path={`${prop.path}`} element={prop.component} key={key} />;
        })
      );
    }
    return routeList;
  };

  document.documentElement.dir = "ltr";
  return (
    <>
      <Layout hasSider style={{ minHeight: "100vh" }}>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div className="flex justify-center p-5">
            <img
              onClick={() => navigate("/")}
              alt="巨集科技"
              src={
                collapsed
                  ? "https://static-1318552943.cos.ap-singapore.myqcloud.com/macro/ui/LOGO2.png"
                  : "https://static-1318552943.cos.ap-singapore.myqcloud.com/macro/ui/LOGO.png"
              }
              className={collapsed ? "h-[20px] cursor-pointer" : "h-[40px] cursor-pointer"}
            />
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[currentRoute]}
            // defaultSelectedKeys={[currentRoute]}
            // defaultOpenKeys={["table"]}
            style={{ borderRight: 0 }}
            items={items3}
            onClick={onClickMenu}
          />
        </Sider>

        <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
          <Header style={{ padding: 0, background: colorBgContainer }}>
            <div className="flex justify-between">
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                  fontSize: "16px",
                  width: 64,
                  height: 64,
                }}
              />
              {table?.id && (
                <>
                  {order?.id && (
                    <div>
                      <Button danger>{order?.id} 加单中</Button>
                    </div>
                  )}
                  <div className="mr-8 cursor-pointer">
                    <Badge count={amount} showZero>
                      <ShoppingOutlined
                        size={200}
                        // className="mr-8 cursor-pointer"
                        style={{ fontSize: "22px" }}
                        onClick={() => {
                          setShowDrawer(true);
                        }}
                      />
                    </Badge>
                  </div>
                </>
              )}
            </div>
          </Header>
          <Breadcrumb style={{ margin: "16px" }} items={breadItems} />
          {/* <Breadcrumb.Item href="/admin/nodes">點餐</Breadcrumb.Item>
            <Breadcrumb.Item>{currentRouteName}</Breadcrumb.Item>
          </Breadcrumb> */}
          <Content
            style={{
              margin: "0px 16px 0",
              overflow: "initial",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div
              style={{
                padding: 24,
                // background: colorBgContainer,
                // borderRadius: borderRadiusLG,
              }}
            >
              {table?.id ? (
                <>
                  <Food
                    table={table}
                    showDrawer={showDrawer}
                    onCloseDrawer={() => setShowDrawer(false)}
                    setAmount={setAmount}
                  />
                </>
              ) : (
                <Routes>
                  {getRoutes(orderRoutes)}

                  <Route path="/" element={<Navigate to="/admin/nodes" replace />} />
                </Routes>
              )}
            </div>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Universal Macro ©{new Date().getFullYear()}
          </Footer>
        </Layout>
      </Layout>
    </>
  );
}
