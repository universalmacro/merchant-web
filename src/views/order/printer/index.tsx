import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, message, Tag } from "antd";
import { RiAddFill } from "react-icons/ri";
import ModalForm from "./modal-form";
import { useParams, useNavigate } from "react-router-dom";
import {
  OrderApi,
  Configuration,
  ConfigurationParameters,
  SpaceApi,
} from "@universalmacro/merchant-ts-sdk";

const paginationConfig = {
  pageSize: 10,
  page: 0,
};

const Tables = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userToken, basePath } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};
  const [messageApi, contextHolder] = message.useMessage();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [printerValue, setPrinterValue] = useState(null);
  const [printerList, setPrinterList] = useState([]);
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
    if (!spaceApi && basePath) {
      setSpaceApi(
        new SpaceApi(
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
      getPrinterList(paginationConfig?.page, paginationConfig?.pageSize);
    }
  }, [userToken, basePath, orderApi]);

  const getPrinterList = async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const res = await spaceApi?.listPrinters({ id: id });
      // if (res?.length > 0) {
      //   let data = res?.map((item: string, index: number) => {
      //     return {
      //       key: index,
      //       name: item,
      //     };
      //   });
      // }
      setPrinterList(res ?? []);

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const errorCallback = (e: any) => {
    Modal.error({
      content: `${e}`,
    });
  };

  const updateSuccess = () => {
    messageApi.open({
      type: "success",
      content: "更新成功",
    });
  };

  const handleDelete = (record: any) => {
    showDeleteConfirm(async () => {
      try {
        const res = await spaceApi?.deletePrinter({ printerId: record?.id });
        getPrinterList(paginationConfig?.page, paginationConfig?.pageSize);
      } catch (e) {
        errorCallback(e);
      }
    });
  };

  const onSave = async (values: any) => {
    console.log("onsave", values);
    try {
      const res = await spaceApi.createPrinter({
        id: id,
        savePrinter: values,
      });
      updateSuccess();
      getPrinterList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {}
    setVisible(false);
  };

  const onUpdate = async (values: any) => {
    console.log("onUpdate", values);
    try {
      const res = await spaceApi.updatePrinter({
        printerId: values?.id,
        savePrinter: values,
      });
      updateSuccess();
      getPrinterList(paginationConfig?.page, paginationConfig?.pageSize);
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

  const addPrinter = () => {
    setPrinterValue(null);
    setVisible(true);
  };

  const editPrinter = (record: any) => {
    setPrinterValue(record);
    setVisible(true);
  };

  const printersColums = [
    {
      title: "打印機ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "名稱",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "類型",
      dataIndex: "type",
      key: "type",
      width: "15%",
      render: (text: string, record: any) => {
        let color = text === "KITCHEN" ? "green" : "cyan";
        return (
          <Tag color={color} key={text}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "打印機 SN",
      dataIndex: "sn",
      key: "sn",
      width: "15%",
    },
    {
      title: "模型",
      dataIndex: "model",
      key: "model",
      width: "10%",
      render: (text: string, record: any) => {
        let color = text === "F58MM" ? "green" : "cyan";
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
      render: (text: any, record: any) => (
        <>
          <span className="mr-4 cursor-pointer text-blue-400" onClick={() => editPrinter(record)}>
            編輯
          </span>
          <span className="cursor-pointer text-red-400 " onClick={() => handleDelete(record)}>
            刪除
          </span>
        </>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <ModalForm
        state={printerValue}
        visible={visible}
        onSave={printerValue?.id == undefined ? onSave : onUpdate}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div>
          <div className="flex justify-between">
            <p className="mb-4 text-xl">打印機列表</p>
            <Button onClick={addPrinter} icon={<RiAddFill />}>
              新增
            </Button>
          </div>
          <Table dataSource={printerList} columns={printersColums} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Tables;
