import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { List, Tabs, Radio, Modal, Tag, Flex, message, Drawer, Space, Button, Divider } from "antd";
// import ModalForm from "./modal-form";
import ModalForm from "./info/info-form";
import { UploadOutlined } from "@ant-design/icons";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  OrderApi,
  SpaceApi,
  Configuration,
  ConfigurationParameters,
  Food,
  Spec,
  FoodSpec,
  Table,
} from "@universalmacro/merchant-ts-sdk";
import { CommonTable } from "@macro-components/common-components";
import { defaultImage } from "../../../utils/constant";
import PrinterModalForm from "./printer-modal-form";
import axios from "axios";
import FoodCard from "./food-card";
import AttributeModal from "./attribute-modal";
import ShoppingCartCard from "./shoppingcart-card";
import { MapEqual, MapToPair, OptionEqual, PairToMap, getCart, getPricing } from "utils/utils";

const paginationConfig = {
  pageSize: 10,
  page: 0,
};

export interface CartItem {
  food: Food;
  spec?: Array<Spec>;
  amount?: number;
}

interface FoodProps {
  showDrawer: boolean;
  table: Table;
  setAmount?: (amount: number) => void;
  onClick?: () => void;
  onCancel?: () => void;
  onCloseDrawer?: () => void;
}

const Tables: React.FC<FoodProps> = ({ showDrawer, onCloseDrawer, setAmount, table }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userToken, basePath } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};

  const [visible, setVisible] = useState(false);
  const [printerVisible, setPrinterVisible] = useState(false);
  const [attributeVisible, setAttributeVisible] = useState(false);
  const [printerValue, setPrinterValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [foodValue, setFoodValue] = useState(null);
  const [tableList, setFoodList] = useState<Food[]>([]);
  const [orderApi, setOrderApi] = useState(null);
  const [tagFilters, setTagFilters] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [printerOptions, setPrinterOptions] = useState([]);
  const [spaceApi, setSpaceApi] = useState(null);
  const [food, setFood] = useState(null);
  const location = useLocation();
  const [messageApi, contextHolder] = message.useMessage();

  const [orders, setOrders] = useState<FoodSpec[]>([]);

  const [previousOrder, setPreviousOrder] = useState(location?.state?.order);

  const { confirm } = Modal;

  const cartOrders = useMemo(() => {
    return getCart(orders, []);
  }, [orders]);

  useEffect(() => {
    if (isNaN(Number(id))) {
      navigate("/spaces");
    }
  }, [id]);

  useEffect(() => {
    setAmount(orders.length);
  }, [orders]);

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
  }, [userToken, basePath, orderApi, spaceApi]);

  const getFoodList = async (page: number, pageSize: number) => {
    let pagination = {
      index: page ?? paginationConfig?.page,
      limit: pageSize ?? paginationConfig?.pageSize,
    };
    setLoading(true);
    try {
      const res = await axios.get(`${basePath}/spaces/${id}/foods`, {
        params: { ...pagination },
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      setFoodList(res.data ?? []);
      let filters: any = [];
      res.data?.categories?.map((e: any) => {
        filters.push({ text: e, value: e });
      });
      setTagFilters(filters);

      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const showError = (text: string) => {
    messageApi.open({
      type: "error",
      content: text,
    });
  };

  const onSubmit = async () => {
    onCloseDrawer();
    if (!previousOrder?.id) {
      try {
        const res = await axios.post(
          `${basePath}/spaces/${id}/orders`,
          {
            tableLabel: table.label,
            foods: orders,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (res) {
          setOrders([]);
          navigate(`/spaces/${id}/menu/bill`);
          // showBillConfirm(() => {});
        }
      } catch (e) {
        console.log(e);
        showError(e.toString());
      }
    } else {
      // 存在已有訂單，加單
      try {
        const res = await axios.put(
          `${basePath}/orders/${previousOrder?.id}/addition`,
          {
            foods: orders,
          },
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (res) {
          setOrders([]);
          navigate(`/spaces/${id}/menu/bill`);
        }
      } catch (e) {
        console.log(e);
        showError(e.toString());
      }
    }
  };

  const getCategoryList = async () => {
    setLoading(true);
    try {
      // const res = await orderApi?.listFoodCategories({ id: id });
      const res = await axios.get(`${basePath}/spaces/${id}/foods/categories`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res?.data?.length > 0) {
        let data = res?.data.map((item: string, index: number) => {
          return {
            key: index,
            name: item,
          };
        });
        let options: any = [];
        res?.data?.map((e: any) => {
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
      // const res = await spaceApi?.listPrinters({ id: id });
      const res = await axios.get(`${basePath}/spaces/${id}/printers`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (res?.data.length > 0) {
        let options: any = [];
        res?.data.map((e: any) => {
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

  const success = () => {
    messageApi.open({
      type: "success",
      content: "創建成功",
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
      // const res = await orderApi.createFood({
      //   id: id,
      //   saveFoodRequest: {
      //     ...values,
      //   },
      // });
      const res = await axios.post(
        `${basePath}/spaces/${id}/foods`,
        {
          ...values,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      success();
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
      // const res = await orderApi.updateFoodPrinters({
      //   id: values.id,
      //   requestBody: [...values],
      // });
      const res = await axios.put(
        `${basePath}/spaces/foods/${values?.id}/printers`,

        { printerIds: [...values?.printers] },

        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
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

  const showBillConfirm = (onOk: any) => {
    confirm({
      title: `打印訂單？`,
      okText: "確認",
      okType: "danger",
      cancelText: "取消",
      onOk,
      onCancel() {
        console.log("OK");
      },
    });
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

  const onSaveAttribute = (item: Food, selectedOptions: Map<string, string>) => {
    setOrders([...orders, { food: item, spec: MapToPair(selectedOptions) }]);
  };

  const removeCart = (item: Food, options: Map<string, string>) => {
    console.log(item, options);
    let index = -1;
    orders.forEach((order, i) => {
      if (order.food.id === item.id && MapEqual(PairToMap(order.spec), options)) {
        index = i;
      }
    });
    setOrders(orders.filter((_, i) => i !== index));
  };

  const pushCart = (item: Food, selectedOptions: Map<string, string>) => {
    // setSelectingSpecificationsItem(undefined);
    setOrders([...orders, { food: item, spec: MapToPair(selectedOptions) }]);
  };

  const total = useMemo(() => {
    return orders.reduce((total, order) => total + getPricing(order), 0);
  }, [orders]);

  return (
    <div>
      {contextHolder}

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

      <AttributeModal
        printerOptions={printerOptions}
        food={food}
        visible={attributeVisible}
        onSave={onSaveAttribute}
        onCancel={() => {
          setAttributeVisible(false);
        }}
      />

      <div className="">
        <Tabs
          defaultActiveKey="1"
          tabPosition={"top"}
          style={{ height: "100%" }}
          items={categoryOptions?.map((i: any) => {
            return {
              label: i.label,
              key: i.value,
              // disabled: i === 28,
              children: (
                <Flex wrap="wrap" gap="small">
                  {tableList
                    .filter((item: Food) => item.categories?.[0] == i.label)
                    .map((item: Food) => {
                      return (
                        <FoodCard
                          item={item}
                          onClick={() => {
                            setAttributeVisible(true);
                            setFood(item);
                          }}
                        />
                      );
                    })}
                </Flex>
              ),
            };
          })}
        />
      </div>
      <Drawer
        title={previousOrder?.id ? `購物車 ( 添加到訂單 ${previousOrder?.id})` : `購物車`}
        placement="right"
        onClose={onCloseDrawer}
        open={showDrawer}
        width={640}
      >
        <div className="flex h-[100%] flex-col justify-between">
          <div>
            {cartOrders.map((item, index) => {
              return (
                <ShoppingCartCard
                  item={item}
                  removeCart={() => removeCart(item.order.food, PairToMap(item.order.spec))}
                  pushCart={pushCart}
                />
              );
            })}
          </div>
          <div className="">
            <Divider />
            <p className="mb-4 flex justify-between text-lg">
              總價：<span className="text-red-500">${total / 100}</span>
            </p>
            <Space className="mb-4 flex items-center">
              <Button type="primary" onClick={onSubmit} className="w-[580px] bg-orange-300">
                提交
              </Button>
            </Space>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Tables;
