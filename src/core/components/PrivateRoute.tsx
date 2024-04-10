import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { userBasePath, userInfoAuth } from "../../features/auth/authActions";
import { NavLink, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import axios from "axios";

import { AppDispatch } from "../../store";
import { logout } from "../../features/auth/authSlice";

const PrivateRoute = ({ children }: any) => {
  const { userToken, userInfo, error, basePath } = useSelector((state: any) => state.auth) || {};
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  console.log("PrivateRouteProps", userToken, userInfo, basePath);

  // 驗證token是否有效
  const getSpaceList = async (page?: number, pageSize?: number) => {
    try {
      const res = await axios.get(`${basePath}/spaces`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
        params: {
          index: 0,
          limit: 10,
        },
      });
    } catch (e) {
      dispatch(logout("auth/LOGOUT_REQUEST"));
    }
  };

  const errorCallback = (e: any) => {
    Modal.error({
      content: `獲取個人信息錯誤：${e}`,
      afterClose: () => {
        localStorage.removeItem("merchant-web-token");
        navigate("/auth/sign-in");
      },
    });
  };

  useEffect(() => {
    if (userToken) {
      if (!basePath) {
        dispatch(userBasePath({}));
      } else {
        getSpaceList();
      }
    }
  }, [basePath]);

  // useEffect(() => {
  //   if (userToken && !userInfo?.id) {
  //     dispatch(userInfoAuth({ token: userToken }));
  //   }
  // }, [userInfo?.id]);

  useEffect(() => {
    if (error) {
      //&& !userInfo?.id
      errorCallback(error);
    }
  }, [error]);

  if (userToken && !error) {
    return children;
  } else {
    return <Navigate to="/auth/sign-in" />;
  }
};

export default PrivateRoute;
