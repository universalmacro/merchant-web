import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal } from "antd";
import { RiAddFill } from "react-icons/ri";
import ModalForm from "./modal-form";
import { useParams, useNavigate } from "react-router-dom";
import { OrderApi, Configuration, ConfigurationParameters } from "@universalmacro/merchant-ts-sdk";
import { CommonTable } from "@macro-components/common-components";
const paginationConfig = {
  pageSize: 10,
  page: 0,
};

const Tables = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userToken, basePath } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableValue, setTableValue] = useState({ label: "", id: "" });
  const [tableList, setTableList] = useState([]);
  const [spaceApi, setSpaceApi] = useState(null);
  const [orderApi, setOrderApi] = useState(null);

  const { confirm } = Modal;

  useEffect(() => {
    if (isNaN(Number(id))) {
      navigate("/spaces");
    }
  }, [id]);

  useEffect(() => {
    if (!orderApi && basePath) {
      setOrderApi(
        new OrderApi(
          new Configuration({
            basePath: basePath,
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          } as ConfigurationParameters)
        )
      );
    }
    if (orderApi && basePath && userToken) {
      getTableList(paginationConfig?.page, paginationConfig?.pageSize);
    }
  }, [userToken, basePath, orderApi]);

  const onChangePage = (page: number, pageSize: number) => {
    getTableList(page ?? paginationConfig?.page, pageSize ?? paginationConfig?.pageSize);
  };

  const getTableList = async (page: number, pageSize: number) => {
    console.log("------------------", orderApi, basePath, userToken);
    setLoading(true);
    try {
      const res = await orderApi?.listTables({ id: id });
      setTableList(res ?? []);
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

  const handleDeleteTable = (record: any) => {
    showDeleteConfirm(async () => {
      console.log("onOK");
      try {
        const res = await orderApi?.deleteTable({ id: record?.id });
        getTableList(paginationConfig?.page, paginationConfig?.pageSize);
      } catch (e) {
        errorCallback(e);
      }
    });
  };

  const onSave = async (values: any) => {
    console.log("onsave", values);
    try {
      const res = await orderApi.createTable({
        id: id,
        saveTableRequest: {
          label: values?.label,
        },
      });
      successCallback();
      getTableList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {}
    setVisible(false);
  };

  const onUpdate = async (values: any) => {
    console.log(values);
    try {
      const res = await orderApi.updateTable({
        id: values.id,
        saveTableRequest: {
          label: values?.label,
        },
      });
      getTableList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {}
    setVisible(false);
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

  const addTable = () => {
    setTableValue({ label: "", id: "" });
    setVisible(true);
  };

  const editTable = (record: any) => {
    setTableValue({ label: record.label, id: record.id });
    setVisible(true);
  };

  const search = (value: string) => {
    if (value === "") {
      getTableList(paginationConfig?.page, paginationConfig?.pageSize);
      return;
    }

    const filterTable = tableList?.filter((o: any) =>
      Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(value.toLowerCase()))
    );

    setTableList(filterTable);
  };
  const tableColums = [
    {
      title: "餐桌ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "餐桌標簽",
      dataIndex: "label",
      key: "label",
      width: "20%",
    },

    {
      title: "操作",
      key: "operation",
      render: (text: any, record: any) => (
        <>
          <span onClick={() => editTable(record)} className="mr-4 text-blue-400">
            編輯
          </span>
          <span className="text-red-400" onClick={() => handleDeleteTable(record)}>
            刪除
          </span>
        </>
      ),
    },
  ];

  return (
    <div>
      <ModalForm
        state={tableValue}
        visible={visible}
        onSave={tableValue?.label == "" ? onSave : onUpdate}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div>
          <CommonTable
            title="餐桌列表"
            onAddItem={addTable}
            onSearch={search}
            dataSource={tableList}
            columns={tableColums}
            loading={loading}
            onChangePage={onChangePage}
          />
        </div>
      </div>
    </div>
  );
};

export default Tables;
