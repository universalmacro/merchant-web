import { useEffect, useState } from "react";
import { updateSelfPassword, basePath } from "api";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Select } from "antd";
import { AppDispatch } from "../../../store";
import { userInfoAuth } from "features/auth/authActions";
import sha256 from "crypto-js/sha256";
import { AdminApi, Configuration, ConfigurationParameters } from "@universalmacro/core-ts-sdk";

type FieldType = {
  oldPassword?: string;
  password?: string;
};

const Tables = () => {
  const { userToken, userInfo } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};
  const [form] = Form.useForm();
  const [newForm] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [adminApi, setAdminApi] = useState(null);

  useEffect(() => {
    form.setFieldsValue({
      account: userInfo?.account,
      role: userInfo?.role,
    });

    if (!adminApi) {
      setAdminApi(
        new AdminApi(
          new Configuration({
            basePath: basePath,
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          } as ConfigurationParameters)
        )
      );
    }
  }, [adminApi, userInfo?.id]);

  const onUpdatePassword = async (values: any) => {
    try {
      let updateAdminPasswordRequest = {
        oldPassword: sha256(sha256(values?.oldPassword).toString()).toString(),
        password: sha256(sha256(values?.password).toString()).toString(),
      };
      try {
        const res = await adminApi?.updateAdminSelfPassword({
          updatePasswordRequest: updateAdminPasswordRequest,
        });
        successCallback();
        dispatch(userInfoAuth({ token: userToken }));
        newForm.setFieldsValue({ oldPassword: "", password: "" });
      } catch (e) {
        errorCallback(e);
      }
    } catch (e) {}
  };

  const successCallback = () => {
    Modal.success({
      content: "更新密碼成功！",
    });
  };

  const errorCallback = (e: any) => {
    Modal.error({
      content: `${e}`,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <p className="mb-4 text-xl">信息</p>
      </div>
      <div className="mt-5 flex grid h-full grid-cols-1 items-center justify-center gap-5 rounded-lg bg-white p-8">
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          autoComplete="off"
        >
          <Form.Item label="帳號" name="account">
            <Input disabled />
          </Form.Item>

          <Form.Item name="role" label="角色">
            <Select
              disabled
              style={{ width: 120 }}
              options={[
                { value: "ROOT", label: "終極管理員" },
                { value: "ADMIN", label: "管理員" },
              ]}
            />
          </Form.Item>
        </Form>
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <p className="mb-4 text-xl">更新密碼</p>
      </div>
      <div className="mt-5 flex grid h-full grid-cols-1 items-center justify-center gap-5 rounded-lg bg-white p-8">
        <Form
          form={newForm}
          name="basic1"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ name: "", description: "" }}
          onFinish={onUpdatePassword}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="原密碼"
            name="oldPassword"
            rules={[{ required: true, message: "請輸入原密碼" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="新密碼"
            name="password"
            rules={[{ required: true, message: "請輸入新密碼" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              更新密碼
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Tables;
