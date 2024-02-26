import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, Button, Modal, Tag } from "antd";
// import ModalForm from "./modal-form";
import ModalForm from "./info/info-form";

import { useParams, useNavigate } from "react-router-dom";
import {
  OrderApi,
  SpaceApi,
  Configuration,
  ConfigurationParameters,
} from "@universalmacro/merchant-ts-sdk";
import { CommonTable } from "@macro-components/common-components";
import { defaultImage } from "../../../utils/constant";
import PrinterModalForm from "./printer-modal-form";

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
  const [printerVisible, setPrinterVisible] = useState(false);
  const [printerValue, setPrinterValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foodValue, setFoodValue] = useState(null);
  const [tableList, setFoodList] = useState([]);
  const [orderApi, setOrderApi] = useState(null);
  const [tagFilters, setTagFilters] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [printerOptions, setPrinterOptions] = useState([]);
  const [spaceApi, setSpaceApi] = useState(null);

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
      getFoodList(paginationConfig?.page, paginationConfig?.pageSize);
      getCategoryList();
      getPrinterList();
    }
  }, [userToken, basePath, orderApi]);

  const onChangePage = (page: number, pageSize: number) => {
    getFoodList(page ?? paginationConfig?.page, pageSize ?? paginationConfig?.pageSize);
  };

  const getFoodList = async (page: number, pageSize: number) => {
    let pagination = {
      index: page ?? paginationConfig?.page,
      limit: pageSize ?? paginationConfig?.pageSize,
    };
    setLoading(true);
    try {
      const res = await orderApi?.listFoods({ id: id, ...pagination });
      setFoodList(res ?? []);
      let filters: any = [];
      res?.categories?.map((e: any) => {
        filters.push({ text: e, value: e });
      });
      setTagFilters(filters);

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getCategoryList = async () => {
    setLoading(true);
    try {
      const res = await orderApi?.listFoodCategories({ id: id });
      if (res?.length > 0) {
        let data = res?.map((item: string, index: number) => {
          return {
            key: index,
            name: item,
          };
        });
        let options: any = [];
        res?.map((e: any) => {
          options.push({ value: e, label: e });
        });
        console.log(options);
        setCategoryOptions(options);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getPrinterList = async () => {
    try {
      const res = await spaceApi?.listPrinters({ id: id });
      if (res?.length > 0) {
        let options: any = [];
        res?.map((e: any) => {
          options.push({ value: e?.id, label: e?.name, ...e });
        });
        console.log(res, options);
        setPrinterOptions(options);
      }
    } catch (e) {}
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

  const onCreate = async (values: any) => {
    console.log("onCreate", values, id);
    try {
      const res = await orderApi.createFood({
        id: id,
        saveFoodRequest: {
          ...values,
        },
      });
      successCallback();
      getFoodList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {}
    setVisible(false);
  };

  const onUpdate = async (values: any) => {
    console.log("onUpdate", values);

    try {
      const res = await orderApi.updateFood({
        id: values.id,
        saveFoodRequest: {
          ...values,
        },
      });
      getFoodList(paginationConfig?.page, paginationConfig?.pageSize);
    } catch (e) {}
    setVisible(false);
  };

  const onUpdatePrinter = async (values: any) => {
    console.log("onUpdate", values);
    try {
      const res = await orderApi.updateFoodPrinters({
        id: values.id,
        requestBody: [...values],
      });
    } catch (e) {}
    setPrinterVisible(false);
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

  const addFood = () => {
    setFoodValue(null);
    setVisible(true);
  };

  const editFood = (record: any) => {
    setFoodValue(record);
    setVisible(true);
  };

  const editPrinter = async (record: any) => {
    setPrinterVisible(true);
    try {
      const res = await orderApi?.listFoodPrinters({ id: record?.id });
      if (res) {
        let data = res?.map((item: string, index: number) => {
          return {
            key: index,
            name: item,
          };
        });
        let options: any = [];
        res?.map((e: any) => {
          options.push({ value: e, label: e });
        });
        console.log(options);
        setPrinterValue({ id: record?.id, printers: options });
      }
    } catch (e) {}
  };

  const handleDelete = (record: any) => {
    showDeleteConfirm(async () => {
      console.log("onOK");
      try {
        const res = await orderApi?.deleteFood({ id: record?.id });
        getFoodList(paginationConfig?.page, paginationConfig?.pageSize);
      } catch (e) {
        errorCallback(e);
      }
    });
  };

  const search = (value: string) => {
    if (value === "") {
      getFoodList(paginationConfig?.page, paginationConfig?.pageSize);
      return;
    }

    const filterTable = tableList?.filter((o: any) =>
      Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(value.toLowerCase()))
    );

    setFoodList(filterTable);
  };
  const tableColums = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "名稱",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "品項圖片",
      dataIndex: "images",
      render: (_: any, { images }: any) => (
        <img
          width="100"
          alt={
            images?.[0]
              ? `${images?.[0]}?imageView2/1/w/268/q/85`
              : `${defaultImage}?imageView2/1/w/268/q/85`
          }
          src={
            images?.[0]
              ? `${images?.[0]}?imageView2/1/w/268/q/85`
              : `${defaultImage}?imageView2/1/w/268/q/85`
          }
        />
      ),
    },
    {
      title: "标签",
      key: "categories",
      dataIndex: "categories",
      filters: tagFilters,
      onFilter: (value: any, record: any) => record.tags?.[0] === value,
      filterSearch: true,
      render: (_: any, { categories }: any) => (
        <>
          {categories?.map((tag: string) => {
            return (
              <Tag color={"green"} key={tag}>
                {tag}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "定價",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (text: number, record: any) => <>${text}</>,
    },
    {
      title: "服務費",
      dataIndex: "fixedOffset",
      key: "fixedOffset",
      width: "10%",
      render: (text: number, record: any) => {
        if (!record?.fixedOffset) {
          return <>無</>;
        } else {
          return <>{text}%</>;
        }
      },
    },
    {
      title: "屬性",
      dataIndex: "attributes",
      key: "attributes",
      render: (attr: any[], record: any) => {
        if (attr?.length == 0) {
          return <>無</>;
        } else {
          return (
            <>
              {attr?.map((item: any) => {
                return (
                  <div className="mt-4 flex">
                    <Tag color={"magenta"} key={item.label}>
                      {item.label}
                    </Tag>
                    <div className="flex">
                      {item?.options?.map((option: any) => {
                        return (
                          <div className="mr-2">
                            {option.label}:{option.extra / 100}{" "}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </>
          );
        }
      },
    },
    {
      title: "狀態",
      dataIndex: "status",
      key: "status",
      width: "10%",
      filters: [
        {
          text: "正常",
          value: "AVAILABLE",
        },
        {
          text: "估空",
          value: "UNAVAILABLE",
        },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      filterSearch: false,
      render: (text: string, record: any) => {
        let color = text === "AVAILABLE" ? "geekblue" : "red";
        let tag = text === "AVAILABLE" ? "正常" : "估空";
        return (
          <Tag color={color} key={tag}>
            {tag}
          </Tag>
        );
      },
    },
    {
      title: "操作",
      key: "operation",
      render: (text: any, record: any) => (
        <>
          <span className="mr-4 cursor-pointer text-blue-400" onClick={() => editFood(record)}>
            編輯
          </span>
          <span className="mr-4 cursor-pointer text-red-400" onClick={() => handleDelete(record)}>
            刪除
          </span>
          <span className="mr-4 cursor-pointer text-blue-400" onClick={() => editPrinter(record)}>
            打印機
          </span>
        </>
      ),
    },
  ];

  return (
    <div>
      <ModalForm
        categoryOptions={categoryOptions}
        state={foodValue}
        visible={visible}
        onSave={foodValue == null ? onCreate : onUpdate}
        onCancel={() => {
          setVisible(false);
        }}
      />
      <PrinterModalForm
        printerOptions={printerOptions}
        state={printerValue}
        visible={printerVisible}
        onSave={onUpdatePrinter}
        onCancel={() => {
          setPrinterVisible(false);
        }}
      />
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <div>
          <CommonTable
            title="FOOD列表"
            onAddItem={addFood}
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
