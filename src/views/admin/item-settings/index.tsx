import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  restaurantApi,
  getPrinters,
  getDiscounts,
  createTable,
  updateTable,
  getRestaurant,
  deleteItems,
} from "api";
import { Table, Button, Modal, Tag, Input, DatePicker, Space } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { toTimestamp } from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { RiAddFill } from "react-icons/ri";
import ModalForm from "../../../components/modal-form";
import { AppDispatch } from "../../../store";
import { getSpaceList } from "../../../features/space/spaceActions";
import { defaultImage } from "../../../utils/constant";
import { NavLink, useNavigate } from "react-router-dom";

const Tables = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [tagFilters, setTagFilters] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tableValue, setTableValue] = useState({ label: "", id: "" });
  const { userToken } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};
  const { restaurantList, restaurantId, restaurantInfo } =
    useSelector((state: any) => state.restaurant) || {};
  const [dataSource, setDataSource] = useState(restaurantInfo?.items);
  const navigate = useNavigate();

  const { confirm } = Modal;

  useEffect(() => {
    setDataSource(restaurantInfo?.items);

    let filters: any = [];
    restaurantInfo?.categories?.map((e: any) => {
      filters.push({ text: e, value: e });
    });
    setTagFilters(filters);
  }, [restaurantId]);

  useEffect(() => {
    console.log("useEffectuseEffectuseEffect", restaurantInfo?.items);
    setDataSource(restaurantInfo?.items);
  }, restaurantInfo?.items);

  // useEffect(() => {
  //   dispatch(getRestaurantInfo({ token: userToken }));
  // }, []);

  const getHeaders = () => {
    return {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${userToken}`,
    };
  };

  const onSave = async (values: any) => {
    console.log(values);
    try {
      const res = await createTable(
        restaurantId,
        { label: values.label },
        {
          headers: getHeaders(),
        }
      );
      // dispatch(getRestaurantInfo({ token: userToken }));
    } catch (e) {}
    setVisible(false);
  };

  const onUpdate = async (values: any) => {
    console.log(values);
    try {
      const res = await updateTable(
        values.id,
        { label: values.label },
        {
          headers: getHeaders(),
        }
      );
      // dispatch(getRestaurantInfo({ token: userToken }));
    } catch (e) {}
    setVisible(false);
  };

  const handleDelete = (record: any) => {
    showDeleteConfirm(async () => {
      try {
        const res = await deleteItems(record.id, {
          headers: getHeaders(),
        });
        // dispatch(getRestaurantInfo({ token: userToken }));

        console.log("handleDelete", res);
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
      console.log(restaurantInfo?.items?.length);
      setDataSource(restaurantInfo?.items);
      return;
    }

    const filterTable = dataSource.filter((o: any) =>
      Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(value.toLowerCase()))
    );

    setDataSource(filterTable);
  };

  const addTable = () => {
    setVisible(true);
  };

  const editTable = (record: any) => {
    setTableValue({ label: record.label, id: record.id });
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
      key: "tags",
      dataIndex: "tags",
      filters: tagFilters,
      onFilter: (value: any, record: any) => record.tags?.[0] === value,
      filterSearch: true,
      render: (_: any, { tags }: any) => (
        <>
          {tags.map((tag: string) => {
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
      dataIndex: "pricing",
      key: "pricing",
      width: "10%",
      render: (text: number, record: any) => <>${text / 100}</>,
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
              {attr.map((item: any) => {
                return (
                  <div className="mt-4 flex">
                    <Tag color={"magenta"} key={item.label}>
                      {item.label}
                    </Tag>
                    <div className="flex">
                      {item.options.map((option: any) => {
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
          value: "ACTIVED",
        },
        {
          text: "估空",
          value: "DEACTIVED",
        },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      filterSearch: false,
      render: (text: string, record: any) => {
        let color = text === "ACTIVED" ? "geekblue" : "red";
        let tag = text === "ACTIVED" ? "正常" : "估空";
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
          <a
            className="mr-4 text-blue-400"
            onClick={() => navigate("/info", { state: { record, restaurantInfo } })}
          >
            編輯
          </a>
          <a className="text-red-400" onClick={() => handleDelete(record)}>
            刪除
          </a>
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
          <div className="flex justify-between">
            <p className="mb-4 inline text-xl">品項列表</p>{" "}
            <Button onClick={() => navigate("/info")} icon={<RiAddFill />}>
              新增
            </Button>
          </div>
          <Input.Search
            style={{ margin: "0 0 10px 0" }}
            placeholder="請輸入 ID / 名稱 / 分類 / 標籤等搜索..."
            enterButton
            onSearch={search}
          />
          <Table dataSource={dataSource} columns={colums} loading={loading} />
        </div>
      </div>
    </div>
  );
};

export default Tables;
