import { useEffect } from "react";
import { Navigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { userInfoAuth } from "../../features/auth/authActions";
import { NavLink, useNavigate } from "react-router-dom";

import { AppDispatch } from "../../store";

const PrivateRoute = ({ children }: any) => {
  const { userToken, userInfo, error } = useSelector((state: any) => state.auth) || {};
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  console.log("PrivateRouteProps", userToken, userInfo);

  useEffect(() => {
    if (userToken && !userInfo?.id) {
      // dispatch(userInfoAuth({ token: userToken }));
    }
  }, [userInfo?.id]);

  if (userToken) {
    return children;
  } else {
    return <Navigate to="/auth/sign-in" />;
  }
};

export default PrivateRoute;
