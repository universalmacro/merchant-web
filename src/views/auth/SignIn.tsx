import { useState, useEffect } from "react";
import InputField from "components/fields/InputField";
import Checkbox from "components/checkbox";
import { NavLink, useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../features/auth/authActions";

import { AppDispatch } from "../../store";

const SignIn = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { userToken, error, userInfo } = useSelector((state: any) => state.auth) || {};

  // redirect authenticated user to profile screen
  useEffect(() => {
    if (userToken) {
      navigate("/admin/manage");
    }
  }, [navigate, userToken]);

  const handleFormSubmit = async (values: any) => {
    dispatch(userLogin({ userName, password }));
  };

  const showError = () => {
    Modal.error({
      title: "登錄失敗",
      content: error,
    });
  };

  useEffect(() => {
    if (error) {
      showError();
    }
  }, [error]);

  return (
    <div className="mb-16 mt-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center">
      {/* Sign in section */}
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">登錄管理員</h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Enter your email and password to sign in!
        </p>
        {/* username */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="用戶名*"
          placeholder="用戶名"
          id="email"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}
        <InputField
          variant="auth"
          extra="mb-3"
          label="密碼*"
          placeholder="密碼"
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* Checkbox */}
        <div className="mb-4 flex items-center justify-between px-2">
          <div className="flex items-center">
            <Checkbox />
            <p className="ml-2 text-sm font-medium text-navy-700 dark:text-white">記住我</p>
          </div>
          <a
            className="text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
            href=" "
          >
            忘記密碼?
          </a>
        </div>
        <button
          className="linear mt-2 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          onClick={handleFormSubmit}
        >
          登錄
        </button>
      </div>
    </div>
  );
};

export default SignIn;
