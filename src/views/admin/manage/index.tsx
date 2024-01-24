import React, { useEffect, useState } from "react";
import {
  createAdmins,
  basePath,
  deleteAdmin,
  getAdmins,
  updateAdminPassword,
  getAdminInfo,
} from "api";
import { Table, Button, Modal, Tag, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RiAddFill } from "react-icons/ri";
import { AppDispatch } from "../../../store";
import { NavLink, useNavigate } from "react-router-dom";
import ModalForm from "./modal-form";
import UpdateModalForm from "./update-modal-form";

import sha256 from "crypto-js/sha256";

import {
  AdminApi,
  Configuration,
  ConfigurationParameters,
  NodeApi,
} from "@universalmacro/core-ts-sdk";

const paginationConfig = {
  pageSize: 10,
  page: 0,
};

const Tables = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [recordVal, setRecordVal] = useState({});

  const { userToken, userInfo } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};
  const [dataSource, setDataSource] = useState([]);

  const { confirm } = Modal;

  const onChangePage = (page: number, pageSize: number) => {
    getAdminList(page ?? paginationConfig?.page, pageSize ?? paginationConfig?.pageSize);
  };

  const updatePassword = async (values: any) => {
    const adminApi = new AdminApi(
      new Configuration({
        basePath: basePath,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      } as ConfigurationParameters)
    );

    let updateAdminPasswordRequest = {
      id: values?.id,
      // password: values?.password,
      password: sha256(sha256(values?.password).toString()).toString(),
    };

    try {
      // const res = await adminApi.updateAdminPassword(UpdateAdminPasswordRequest);
      const res = await updateAdminPassword(
        values?.id,
        { ...updateAdminPasswordRequest },
        {
          headers: getHeaders(),
        }
      );
    } catch (e) {}
  };

  const getAdminList = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      let pagination = {
        index: page ?? paginationConfig?.page,
        limit: pageSize ?? paginationConfig?.pageSize,
      };
      const res = await getAdmins({
        headers: getHeaders(),
        params: { ...pagination },
      });
      setDataSource(res?.items);
      setLoading(false);
    } catch (e) {
      console.log("getAdminList", e);
      setLoading(false);
    }
  };

  const getInfo = async () => {
    const res = await getAdminInfo("1746764246491856896", {
      headers: getHeaders(),
    });
  };
  useEffect(() => {
    // getInfo();
  }, []);

  useEffect(() => {
    // getAdminList(paginationConfig?.page, paginationConfig?.pageSize);
  }, [userToken]);

  const getHeaders = () => {
    return {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${userToken}`,
    };
  };

  const onSave = async (values: any) => {
    console.log("onSave===================", values);
    const adminApi = new AdminApi(
      new Configuration({
        basePath: basePath,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      } as ConfigurationParameters)
    );

    try {
      const res = await createAdmins(
        { ...values, password: sha256(sha256(values?.password).toString()).toString() },
        {
          headers: getHeaders(),
        }
      );
      getAdminList(paginationConfig?.page, paginationConfig?.pageSize);
      // const res = await adminApi.createAdmin({ ...values });
    } catch (e) {}
    setVisible(false);
  };

  const onUpdate = async (values: any) => {
    setUpdateVisible(true);
  };

  const handleDelete = (record: any) => {
    showDeleteConfirm(async () => {
      try {
        const res = await deleteAdmin(record.id, {
          headers: getHeaders(),
        });
        console.log("handleDelete", res);
        getAdminList(paginationConfig?.page, paginationConfig?.pageSize);
      } catch (e) {}
    });
  };

  const showDeleteConfirm = (onOk: any) => {
    confirm({
      title: "確認刪除？",
      // icon: <ExclamationCircleFilled />,
      // content: '確認刪除？',
      okText: "確認",
      okType: "danger",
      cancelText: "取消",
      onOk,
      onCancel() {
        console.log("OK");
      },
    });
  };

  const search = (value: string) => {
    if (value === "") {
      getAdminList(paginationConfig?.page, paginationConfig?.pageSize);
      return;
    }

    const filterTable = dataSource.filter((o: any) =>
      Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(value.toLowerCase()))
    );

    setDataSource(filterTable);
  };

  const addPerson = () => {
    setVisible(true);
  };

  const colums = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "賬號",
      dataIndex: "account",
      key: "account",
      width: "10%",
    },
    {
      title: "提交時間",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "20%",
      render: (text: any, record: any) => <>{new Date(text * 1000).toLocaleString()}</>,
    },
    {
      title: "更新時間",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "20%",
      render: (text: any, record: any) => <>{new Date(text * 1000).toLocaleString()}</>,
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      width: "15%",
      onFilter: (value: any, record: any) => record.status === value,
      filterSearch: false,
      render: (text: string, record: any) => {
        let color = text === "ROOT" ? "geekblue" : "cyan";
        return (
          <Tag color={color} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "操作",
      key: "operation",
      hidden: userInfo?.role !== "ROOT",
      render: (text: any, record: any) => (
        <>
          <a
            className="mr-4 text-blue-400"
            onClick={() => {
              setRecordVal(record);
              onUpdate(record);
            }}
          >
            更新密碼
          </a>
          <a className="text-red-400" onClick={() => handleDelete(record)}>
            刪除
          </a>
        </>
      ),
    },
  ].filter((item) => !item.hidden);

  return (
    <div>
      <ModalForm
        state={formValues}
        visible={visible}
        onSave={onSave}
        onCancel={() => {
          setVisible(false);
        }}
      />

      <UpdateModalForm
        state={recordVal}
        visible={updateVisible}
        onSave={updatePassword}
        onCancel={() => {
          setUpdateVisible(false);
        }}
      />

      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div>
          <div className="flex justify-between">
            <p className="mb-4 inline text-xl">人員列表</p>{" "}
            {userInfo?.role === "ROOT" && (
              <Button onClick={addPerson} icon={<RiAddFill />}>
                新增
              </Button>
            )}
          </div>
          <Input.Search
            style={{ margin: "0 0 10px 0" }}
            placeholder="請輸入 ID / 角色 / 賬號 等搜索..."
            enterButton
            onSearch={search}
          />
          <Table
            dataSource={dataSource}
            columns={colums}
            loading={loading}
            pagination={{
              onChange: onChangePage,
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Tables;
