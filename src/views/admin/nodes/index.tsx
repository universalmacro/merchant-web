import { useEffect, useState } from "react";
import { basePath } from "api";
import { Table, Button, Modal, Tag, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RiAddFill } from "react-icons/ri";
import { AppDispatch } from "../../../store";
import { NavLink, useNavigate } from "react-router-dom";
import ModalForm from "./modal-form";

import { Configuration, ConfigurationParameters, NodeApi } from "@universalmacro/core-ts-sdk";

const paginationConfig = {
  pageSize: 10,
  page: 0,
};

const Tables = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [nodeApi, setNodeApi] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({});
  const { userToken, userInfo } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};
  const { restaurantList, restaurantId, restaurantInfo } =
    useSelector((state: any) => state.restaurant) || {};
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();

  const { confirm } = Modal;

  const onChangePage = (page: number, pageSize: number) => {
    getNodeList(page ?? paginationConfig?.page, pageSize ?? paginationConfig?.pageSize);
  };

  const getNodeList = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      let pagination = {
        index: page ?? paginationConfig?.page,
        limit: pageSize ?? paginationConfig?.pageSize,
      };
      const res = await nodeApi?.listNode({ ...pagination });
      setDataSource(res?.items);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!nodeApi) {
      setNodeApi(
        new NodeApi(
          new Configuration({
            basePath: basePath,
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          } as ConfigurationParameters)
        )
      );
    }
    getNodeList(paginationConfig?.page, paginationConfig?.pageSize);
  }, [nodeApi, userInfo?.id, userToken]);

  const onSave = async (values: any) => {
    try {
      const res = await nodeApi.createNode({
        createNodeRequest: {
          name: values?.name,
          description: values?.description,
        },
      });
      successCallback();
      getNodeList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {}
    setVisible(false);
  };

  const successCallback = () => {
    Modal.success({
      content: "創建成功！",
    });
  };

  const handleDelete = (record: any) => {
    showDeleteConfirm(async () => {
      // try {
      //   const res = await deleteItems(record.id, {
      //     headers: getHeaders()
      //   });
      //   console.log("handleDelete", res);
      // } catch (e) {
      // }
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
      getNodeList(paginationConfig?.page, paginationConfig?.pageSize);
      return;
    }

    const filterTable = dataSource?.filter((o: any) =>
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
      title: "節點名稱",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
      width: "20%",
      render: (text: any, record: any) => {
        if (!text) {
          return <>無</>;
        } else {
          return <>{text}</>;
        }
      },
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
      title: "操作",
      key: "operation",
      hidden: userInfo?.role !== "ROOT",
      render: (text: any, record: any) => (
        <>
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

      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div>
          <div className="flex justify-between">
            <p className="mb-4 inline text-xl">節點列表</p>{" "}
            <Button onClick={addPerson} icon={<RiAddFill />}>
              新增
            </Button>
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
