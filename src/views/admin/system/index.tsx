import React, { useEffect, useState, useMemo } from "react";
import { restaurantApi, getBillList } from "api";
import { Table, Tag, Badge, DatePicker, Space, Modal } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { toTimestamp } from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import ModalForm from "./modal-form";

import {
  Configuration as MerchantConfig,
  ConfigurationParameters as MerchantConfigParams,
  MerchantApi,
  SpaceApi,
} from "@universalmacro/merchant-ts-sdk";
import { CommonTable } from "@macro-components/common-components";
const paginationConfig = {
  pageSize: 10,
  page: 0,
};
const { RangePicker } = DatePicker;

const Tables = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [dataSource, setDataSource] = useState([]);
  const { userToken, basePath } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};
  const [merchantApi, setMerchantApi] = useState(null);
  const [spaceApi, setSpaceApi] = useState(null);
  const { confirm } = Modal;
  const [spaceValue, setSpaceValue] = useState({ name: "", description: "", id: "" });

  useEffect(() => {
    if (basePath && !spaceApi) {
      setSpaceApi(
        new SpaceApi(
          new MerchantConfig({
            basePath: basePath,
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          } as MerchantConfigParams)
        )
      );
    }
    if (spaceApi && basePath && userToken) {
      getSpaceList(paginationConfig?.page, paginationConfig?.pageSize);
    }
  }, [userToken, basePath, spaceApi]);

  const onChangePage = (page: number, pageSize: number) => {
    getSpaceList(page ?? paginationConfig?.page, pageSize ?? paginationConfig?.pageSize);
  };

  const getSpaceList = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      let pagination = {
        index: page ?? paginationConfig?.page,
        limit: pageSize ?? paginationConfig?.pageSize,
      };
      const res = await spaceApi?.listSpaces({ ...pagination });
      setDataSource(res?.items ?? []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const successCallback = () => {
    Modal.success({
      content: "創建成功！",
    });
  };

  const errorCallback = (e: any) => {
    Modal.error({
      content: `${e}`,
    });
  };

  const handleDelete = (record: any) => {
    showDeleteConfirm(async () => {
      try {
        const res = await spaceApi?.deleteSpace({ id: record?.id });
        getSpaceList(paginationConfig?.page, paginationConfig?.pageSize);
      } catch (e) {
        errorCallback(e);
      }
    });
  };

  const showDeleteConfirm = (onOk: any) => {
    confirm({
      title: "確認刪除？",
      okText: "確認",
      okType: "danger",
      cancelText: "取消",
      onOk,
      onCancel() {
        console.log("OK");
      },
    });
  };

  const onSave = async (values: any) => {
    console.log("onsave", values);
    try {
      const res = await spaceApi.createSpace({
        saveSpaceRequest: {
          name: values?.name,
          description: values?.description ?? "",
        },
      });
      successCallback();
      getSpaceList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {}
    setVisible(false);
  };

  const onUpdate = async (values: any) => {
    console.log(values);
    try {
      const res = await spaceApi.updateSpace({
        id: values.id,
        saveSpaceRequest: {
          name: values?.name,
          description: values?.description ?? "",
        },
      });
      getSpaceList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {}
    setVisible(false);
  };

  const editSpace = (record: any) => {
    setSpaceValue({ name: record.name, description: record.description, id: record.id });
    setVisible(true);
  };

  const onOk = (value: DatePickerProps["value"] | RangePickerProps["value"]) => {
    console.log("onOk: ", value);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "名稱",
      dataIndex: "name",
      key: "name",
      width: "16%",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: "16%",
    },
    {
      title: "操作",
      key: "operation",
      width: "20%",
      render: (text: any, record: any) => (
        <>
          <span onClick={() => editSpace(record)} className="mr-4 text-blue-400">
            編輯
          </span>
          <span
            className="mr-4 cursor-pointer text-red-400"
            onClick={(e: any) => {
              e.stopPropagation();
              handleDelete(record);
            }}
          >
            刪除
          </span>
        </>
      ),
    },
  ];

  const addSpace = () => {
    setVisible(true);
  };

  return (
    <div>
      <ModalForm
        state={spaceValue}
        visible={visible}
        onSave={spaceValue?.name == "" ? onSave : onUpdate}
        onCancel={() => {
          setVisible(false);
        }}
      />

      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div>
          <CommonTable
            title="空間列表"
            onAddItem={addSpace}
            // onSearch={search}
            dataSource={dataSource}
            columns={columns}
            loading={loading}
            onChangePage={onChangePage}
          />
        </div>
      </div>
    </div>
  );
};

export default Tables;
