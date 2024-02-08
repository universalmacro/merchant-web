import React, { useEffect, useState, useMemo } from "react";
import { restaurantApi, updateRestaurant, deleteRestaurant, createRestaurant } from "api";
import { Table, Tag, Badge, DatePicker, Space, Modal } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { toTimestamp } from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input } from "antd";
import { AppDispatch } from "../../../store";
import { getSpaceList } from "../../../features/space/spaceActions";
import ConfirmModalForm from "components/confirm-modal-form";

type FieldType = {
  name?: string;
  description?: string;
};

const Tables = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userToken, basePath } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};
  const { restaurantList, restaurantId, restaurantInfo } =
    useSelector((state: any) => state.restaurant) || {};
  const [form] = Form.useForm();
  const [newForm] = Form.useForm();

  const dispatch = useDispatch<AppDispatch>();
  const { confirm } = Modal;
  const [visible, setVisible] = useState(false); // table

  useEffect(() => {
    console.log("restaurantInfo-useEffect", restaurantInfo);
    form.setFieldsValue({
      name: restaurantInfo?.name,
      description: restaurantInfo?.description,
    });
  }, [restaurantId]);

  const onSave = async (values: any) => {
    console.log(values);
    if (values?.label === restaurantInfo?.name) {
      setVisible(false);
      try {
        const res = await deleteRestaurant(restaurantId, {
          headers: getHeaders(),
        });
        successCallback();
        dispatch(getSpaceList({ token: userToken, url: basePath }));
      } catch (e) {}
    }
  };

  const getHeaders = () => {
    return {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${userToken}`,
    };
  };

  const handleDelete = () => {
    setVisible(true);
  };

  const onCreate = async (values: any) => {
    console.log("Success:", { ...values, categories: [] });
    try {
      const res = await createRestaurant(
        { ...values, categories: [] },
        {
          headers: getHeaders(),
        }
      );
      if (res) {
        successCallback();
        dispatch(getSpaceList({ token: userToken, url: basePath }));
        newForm.setFieldsValue({ name: "", description: "" });
      }
    } catch (e) {}
  };

  const onFinish = async (values: any) => {
    console.log("Success:", { ...values, categories: restaurantInfo?.categories });
    try {
      const res = await updateRestaurant(
        restaurantId,
        { ...values, categories: restaurantInfo?.categories },
        {
          headers: getHeaders(),
        }
      );
      if (res) {
        successCallback();
        dispatch(getSpaceList({ token: userToken, url: basePath }));
      }
    } catch (e) {}
  };

  const successCallback = () => {
    Modal.success({
      content: "更新餐廳成功！",
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      <ConfirmModalForm
        visible={visible}
        onSave={onSave}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <div className="mt-5 flex grid h-full grid-cols-1 items-center justify-center gap-5 rounded-lg bg-white p-8">
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ name: restaurantInfo?.name, description: restaurantInfo?.description }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="餐廳名稱"
            name="name"
            rules={[{ required: true, message: "請輸入餐廳名稱" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="餐廳描述" name="description">
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button danger className="mr-4" onClick={handleDelete}>
              刪除餐廳
            </Button>
            <Button type="primary" htmlType="submit">
              提交編輯
            </Button>
          </Form.Item>
        </Form>
      </div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <p className="mb-4 text-xl">新增餐廳</p>
      </div>
      <div className="mt-5 flex grid h-full grid-cols-1 items-center justify-center gap-5 rounded-lg bg-white p-8">
        <Form
          form={newForm}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ name: "", description: "" }}
          onFinish={onCreate}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="餐廳名稱"
            name="name"
            rules={[{ required: true, message: "請輸入餐廳名稱" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType> label="餐廳描述" name="description">
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              新增餐廳
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Tables;
