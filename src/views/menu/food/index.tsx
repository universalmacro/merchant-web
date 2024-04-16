import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Table, List, Tabs, Radio, Modal, Tag, Flex, message, Drawer, Space, Button } from "antd";
// import ModalForm from "./modal-form";
import ModalForm from "./info/info-form";
import { UploadOutlined } from "@ant-design/icons";

import { useParams, useNavigate } from "react-router-dom";
import {
  OrderApi,
  SpaceApi,
  Configuration,
  ConfigurationParameters,
  Food,
  Spec,
  FoodSpec,
} from "@universalmacro/merchant-ts-sdk";
import { CommonTable } from "@macro-components/common-components";
import { defaultImage } from "../../../utils/constant";
import PrinterModalForm from "./printer-modal-form";
import axios from "axios";
import FoodCard from "./food-card";
import AttributeModal from "./attribute-modal";
import ShoppingCartCard from "./shoppingcart-card";
import { MapToPair, OptionEqual } from "utils/utils";

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
  setAmount?: (amount: number) => void;
  onClick?: () => void;
  onCancel?: () => void;
  onCloseDrawer?: () => void;
}

const Tables: React.FC<FoodProps> = ({ showDrawer, onCloseDrawer, setAmount }) => {
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

  const [messageApi, contextHolder] = message.useMessage();

  // 提交訂單用
  const [foods, setFoods] = useState([]);
  // 購物車用
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState<FoodSpec[]>([]);

  const { confirm } = Modal;

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
      // const res = await orderApi?.listFoods({ id: id, ...pagination });
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

  const onSubmit = () => {};

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

  const showImportConfirm = (onOk: any, num: number) => {
    confirm({
      title: `確認導入${num}條數據？`,
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

  // const onSaveAttribute = (item: any) => {
  //   console.log("onSaveAttributeonSaveAttribute", item);
  //   if (cart.length == 0) {
  //     cart.push({ ...item, amount: 1 });
  //   } else {
  //     cart?.map((i: any, index: number) => {
  //       if (i?.food.id === item?.food.id) {
  //         // 同屬性
  //         if (OptionEqual(i?.spec, item?.spec)) {
  //           cart[index].amount += 1;
  //         } else {
  //           cart.push({ ...item, amount: 1 });
  //         }
  //       } else {
  //         cart.push({ ...item, amount: 1 });
  //       }
  //     });
  //   }

  //   setCart(cart);
  // };

  const onSaveAttribute = (item: Food, selectedOptions: Map<string, string>) => {
    // setSelectingSpecificationsItem(undefined);
    setOrders([...orders, { food: item, spec: MapToPair(selectedOptions) }]);
  };

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
        title={`購物車`}
        placement="right"
        // size={"large"}
        onClose={onCloseDrawer}
        open={showDrawer}
        width={640}
        extra={
          <Space>
            <Button type="primary" onClick={onSubmit}>
              提交
            </Button>
          </Space>
        }
      >
        <div>
          {cart?.map((item: CartItem) => {
            return <ShoppingCartCard item={item} />;
          })}
        </div>
      </Drawer>
    </div>
  );
};

export default Tables;
