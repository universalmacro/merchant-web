import React, { useEffect, useState, useMemo } from "react";
import { restaurantApi, getBillList } from "api";
import { Table, Tag, Badge, DatePicker, Space, Modal } from "antd";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { toTimestamp } from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";

const { RangePicker } = DatePicker;

const Tables = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userToken } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};
  const { restaurantList, restaurantId, restaurantInfo } =
    useSelector((state: any) => state.restaurant) || {};

  const getHeaders = () => {
    return {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${userToken}`,
    };
  };

  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    console.log("timestamp", toTimestamp(dateString[0]));

    getDataSourceByDate(toTimestamp(dateString?.[0]), toTimestamp(dateString?.[1]));
  };

  const onOk = (value: DatePickerProps["value"] | RangePickerProps["value"]) => {
    console.log("onOk: ", value);
  };

  const getDataSourceByDate = async (start: number, end: number) => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      // const res = await restaurantApi.listBills({
      //   restaurantId: '1717358125507416064',
      //   // status?: BillStatus;
      //   startAt: start,
      //   endAt: end,
      //   // tableId?: string;
      // });
      let params = {
        params: { restaurantId: restaurantId, startAt: start, endAt: end },
        headers: getHeaders(),
      };
      const res = await getBillList(params);
      setDataSource(res);
      setLoading(false);
    } catch (e) {}
  };

  const billData = async () => {
    if (!restaurantId) return;
    setLoading(true);
    try {
      let params = {
        params: { restaurantId: restaurantId },
        headers: getHeaders(),
      };
      const res = await getBillList(params);
      setDataSource(res);
      setLoading(false);
    } catch (e) {}
  };

  const showInfo = (record: any) => {
    console.log("show", record);
    Modal.info({
      title: "訂單詳情",
      content: (
        <div>
          <ul className="mr-4 max-w-md divide-y divide-gray-200 dark:divide-gray-700">
            {record?.orders?.map((order: any) => {
              return (
                <>
                  <li className="pb-3sm:pb-4 pt-3">
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                          {order?.item?.name}
                        </p>
                        <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                          {order?.specification.map((i: any) => {
                            return (
                              <span>
                                {i.left}: {i.right}
                              </span>
                            );
                          })}
                        </p>
                      </div>
                      <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        ${order?.item?.pricing / 100}
                      </div>
                    </div>
                  </li>
                </>
              );
            })}
          </ul>
          <div className="text-black mr-4 mt-4 flex-grow text-right text-base font-semibold dark:text-white">
            總價：${record?.total / 100}
          </div>
        </div>
      ),
      onOk() {},
    });
  };

  useEffect(() => {
    console.log("userToken", userToken);
    billData();
  }, [userToken, restaurantId]);

  const columns = [
    {
      title: "訂單ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "提交時間",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (text: any, record: any) => <>{new Date(text * 1000).toLocaleString()}</>,
    },
    {
      title: "訂單狀態",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "已提交",
          value: "SUBMITTED",
        },
        {
          text: "已完成",
          value: "PAIED",
        },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      filterSearch: false,
      width: "15%",
      render: (text: string, record: any) => (
        <>
          {text == "SUBMITTED" ? (
            <Badge status="processing" text={"已提交"} />
          ) : (
            <Badge status="success" text={"已完成"} />
          )}
        </>
      ),
    },
    {
      title: "餐桌號",
      dataIndex: "tableLabel",
      key: "tableLabel",
      width: "16%",
    },
    {
      title: "折扣",
      dataIndex: "offset",
      key: "offset",
      width: "10%",
    },
    {
      title: "總額",
      dataIndex: "total",
      key: "total",
      width: "15%",
      render: (text: number, record: any) => <>${text / 100}</>,
    },
    {
      title: "訂單詳情",
      key: "operation",
      width: 100,
      render: (text: any, record: any) => (
        <a className="text-blue-400" onClick={() => showInfo(record)}>
          查看
        </a>
      ),
    },
  ];

  return (
    <div>
      {/* <TableContainer columns={columns} data={rowData} />; */}
      <div className="mt-5 grid h-full grid-cols-1 gap-5">
        <Space direction="vertical" size={12}>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChange}
            onOk={onOk}
          />
        </Space>
        <Table dataSource={dataSource} columns={columns} loading={loading} />
      </div>
    </div>
  );
};

export default Tables;
