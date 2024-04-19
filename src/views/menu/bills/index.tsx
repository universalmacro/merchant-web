import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Divider, Modal, Table, Tag, message, Input, DatePicker, Space } from "antd";
import type { TableColumnsType } from "antd";
import { Order, OrderStatus } from "@universalmacro/merchant-ts-sdk";
import axios from "axios";
import ModalForm from "./modal-form";
import type { DatePickerProps, RangePickerProps } from "antd/es/date-picker";
import { toTimestamp } from "utils/utils";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DetailModal from "./detail-modal";
import TableModalForm from "./table-modal-form";
const { RangePicker } = DatePicker;

const paginationConfig = {
  pageSize: 10,
  page: 0,
};

const App: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { userToken, basePath } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};
  const [billList, setBillList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const [visible, setVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  // 更改桌號框
  const [tableVisible, setTableVisible] = useState(false);
  const [tableOptions, setOptions] = useState([]);

  const [messageApi, contextHolder] = message.useMessage();
  const [action, setAction] = useState("print");
  const [order, setOrder] = useState(null);

  const { confirm } = Modal;
  dayjs.extend(customParseFormat);
  const dateFormat = "YYYY-MM-DD";

  const [start, setStart] = useState(dayjs(dayjs().startOf("day"), dateFormat));
  const [end, setEnd] = useState(dayjs(dayjs().endOf("day"), dateFormat));

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Order[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
      setSelectedIds(selectedRowKeys);
    },
    // getCheckboxProps: (record: Order) => ({
    //   key: record.id,
    // }),
  };

  const getTableList = async () => {
    try {
      const res = await axios.get(`${basePath}/spaces/${id}/tables`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // res.data
      if (res?.data.length > 0) {
        let options: any = [];
        res?.data.map((e: any) => {
          options.push({ value: e?.label, label: e?.label, ...e });
        });
        console.log(res, options);
        setOptions(options);
      }
    } catch (e) {}
  };

  const findTableIdByName = (name: string) => {
    return tableOptions?.filter((table: any) => table.label === name)?.[0] ?? null;
  };

  const columns: TableColumnsType<Order> = [
    {
      title: "訂單 ID",
      dataIndex: "id",
    },
    {
      title: "桌號",
      dataIndex: "tableLabel",
    },
    {
      title: "取餐號",
      dataIndex: "code",
    },
    {
      title: "提交時間",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "15%",
      render: (text: any, record: any) => <>{new Date(text * 1000).toLocaleString()}</>,
    },
    {
      title: "更新時間",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: "15%",
      render: (text: any, record: any) => <>{new Date(text * 1000).toLocaleString()}</>,
    },
    {
      title: "狀態",
      dataIndex: "status",
      key: "status",
      width: "8%",
      filters: [
        {
          text: "已提交",
          value: OrderStatus.Submitted,
        },
        {
          text: "已取消",
          value: OrderStatus.Cancelled,
        },
        {
          text: "已完成",
          value: OrderStatus.Completed,
        },
      ],
      onFilter: (value: any, record: any) => record.status === value,
      filterSearch: false,
      render: (text: string, record: any) => {
        let color =
          text === OrderStatus.Submitted
            ? "geekblue"
            : text === OrderStatus.Cancelled
            ? "lightgrey"
            : "cyan";
        let tag =
          text === OrderStatus.Submitted
            ? "已提交"
            : text === OrderStatus.Cancelled
            ? "已取消"
            : "已完成";
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
      width: "25%",
      render: (text: any, record: any) => (
        <>
          {/* <span
            className="mr-4 cursor-pointer text-blue-400"
            onClick={() => {
              setSelectedIds([record.id]);
              setAction("print");
              setVisible(true);
            }}
          >
            打印
          </span>
          <span className="mr-4 cursor-pointer text-blue-400" onClick={() => finishBill(record)}>
            完成
          </span> */}
          <span
            className="mr-4 cursor-pointer text-blue-400"
            onClick={() => {
              setOrder(record);
              setDetailVisible(true);
            }}
          >
            查看
          </span>
          <span
            className="mr-4 cursor-pointer text-blue-400"
            onClick={() => {
              setOrder(record);
              setTableVisible(true);
            }}
          >
            改桌號
          </span>

          <span
            className="cursor-pointer text-blue-400 "
            onClick={(e: any) => {
              e.stopPropagation();
              setOrder(record);
              let table = findTableIdByName(record?.tableLabel);
              if (table) {
                // todo：跳轉點餐
                navigate(`/spaces/${id}/menu/table?id=${table?.id}?orderId=${record.id}`, {
                  state: { record: table, order: record },
                });
              }
            }}
          >
            加單
          </span>
        </>
      ),
    },
  ];

  useEffect(() => {
    if (basePath && userToken) {
      getBillListByDate(start.unix(), end.unix());

      getTableList();
    }
  }, [userToken, basePath, start, end]);

  const onChange = (
    value: DatePickerProps["value"] | RangePickerProps["value"],
    dateString: [string, string] | string
  ) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
    console.log("timestamp", toTimestamp(dateString[0]));

    setStart(dayjs(dateString?.[0]) ?? null);
    setEnd(dayjs(dateString?.[1]) ?? null);

    // getBillListByDate(toTimestamp(dateString?.[0]), toTimestamp(dateString?.[1]));
  };

  // useEffect(() => {
  //   getBillListByDate(start.unix(), end.unix());
  // }, [start, end]);

  const onOk = (value: DatePickerProps["value"] | RangePickerProps["value"]) => {
    console.log("onOk: ", value);
  };

  const getBillList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${basePath}/spaces/${id}/orders`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      let columns =
        res?.data.map((item: any) => {
          return { ...item, key: item.id };
        }) ?? [];
      setBillList(columns);
      // setBillList(res?.data ?? []);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const getBillListByDate = async (start: number, end: number) => {
    if (!id) return;
    setLoading(true);
    try {
      let params = {
        params: { spaceId: id, startAt: start, endAt: end },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const res = await axios.get(`${basePath}/spaces/${id}/orders`, params);
      let columns =
        res?.data.map((item: any) => {
          return { ...item, key: item.id };
        }) ?? [];
      setBillList(columns);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const search = (value: string) => {
    if (value === "") {
      getBillList();
      return;
    }

    const filterTable = billList.filter((o: any) =>
      Object.keys(o).some((k) => String(o[k]).toLowerCase().includes(value.toLowerCase()))
    );

    console.log(value, filterTable);

    setBillList(filterTable);
  };

  const showBillConfirm = (onOk: any) => {
    confirm({
      title: `打印 ${selectedIds.length} 條訂單？`,
      okText: "確認",
      okType: "danger",
      cancelText: "取消",
      onOk,
      onCancel() {
        console.log("OK");
      },
    });
  };

  const printBill = async (amount: any) => {
    try {
      const res = await axios.post(
        `${basePath}/orders/bills/print`,
        {
          amount: amount,
          orderIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (res) {
        showSuccess("打印成功");
        setSelectedIds([]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const finishBill = async (amount: any) => {
    try {
      const res = await axios.post(
        `${basePath}/orders/bills`,
        {
          amount: amount,
          orderIds: selectedIds,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (res) {
        showSuccess("完成訂單成功");
        setSelectedIds([]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const onClickPrint = () => {
    setAction("print");
    setVisible(true);
  };

  const onClickFinish = () => {
    setAction("finish");
    setVisible(true);
  };

  const onSave = (value: any) => {
    console.log(value);
    if (action == "print") {
      printBill(value.amount);
    } else {
      finishBill(value.amount);
    }
  };

  const showSuccess = (text: string) => {
    messageApi.open({
      type: "success",
      content: text,
    });
  };

  const showError = (text: string) => {
    messageApi.open({
      type: "error",
      content: text,
    });
  };

  // 更換桌號
  const onUpdateTable = async (values: any) => {
    console.log("onUpdate", values);
    try {
      const res = await axios.put(
        `${basePath}/orders/${order.id}/tableLabel`,

        { tableLabel: values?.label },

        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      showSuccess("更新成功");
      getBillList();
    } catch (e) {
      showError(e.toString());
    }
    setTableVisible(false);
  };

  return (
    <div>
      {contextHolder}
      <ModalForm
        visible={visible}
        onSave={onSave}
        onCancel={() => {
          setVisible(false);
        }}
      />

      <TableModalForm
        options={tableOptions}
        visible={tableVisible}
        onSave={onUpdateTable}
        onCancel={() => {
          setTableVisible(false);
        }}
      />

      <DetailModal
        order={order}
        visible={detailVisible}
        onSave={onSave}
        onCancel={() => {
          setDetailVisible(false);
        }}
      />

      <div className="flex justify-between">
        <div className="flex">
          <Button className="mr-2" onClick={onClickPrint} disabled={selectedIds.length === 0}>
            打印訂單
          </Button>
          <Button onClick={onClickFinish} disabled={selectedIds.length === 0}>
            完成訂單
          </Button>
        </div>
      </div>
      <Divider />

      <div className="flex justify-between">
        <Space direction="vertical" size={12}>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            onChange={onChange}
            onOk={onOk}
            defaultValue={[
              dayjs(dayjs().startOf("day"), dateFormat),
              dayjs(dayjs().endOf("day"), dateFormat),
            ]}
          />
        </Space>
        <Input.Search
          style={{ margin: "0 0 10px 0", width: "250px" }}
          placeholder="請輸入 ID / 標籤等搜索..."
          enterButton
          onSearch={search}
        />
      </div>
      <Table
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        loading={loading}
        columns={columns}
        dataSource={billList}
      />
    </div>
  );
};

export default App;
