import { useEffect, useMemo } from "react";
import { SpaceTable } from "types/food";
import { Modal, Space, Button, Divider } from "antd";
import { Order } from "@universalmacro/merchant-ts-sdk";
import ShoppingCartCard from "../../food/shoppingcart-card";
import { getCart, getPricing } from "utils/utils";

interface DetailModalProps {
  visible: boolean;
  order: Order;
  onSave: (table: SpaceTable) => void;
  onCancel: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ visible, order, onSave, onCancel }) => {
  const cartOrders = useMemo(() => {
    return getCart(order?.foods, []);
  }, [order]);

  const total = useMemo(() => {
    return order?.foods.reduce((total, food) => total + getPricing(food), 0);
  }, [order?.foods]);

  return (
    <Modal
      open={visible}
      title="订单详情"
      okText="確認打印"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {}}
    >
      <div className="flex h-[100%] flex-col justify-between">
        <p>
          取餐號：{order?.code} 桌號：{order?.tableLabel}
        </p>
        <div>
          {cartOrders.map((item, index) => {
            return (
              <ShoppingCartCard
                item={item}
                removeCart={() => {}} //removeCart(item.order.food, PairToMap(item.order.spec))
                pushCart={() => {}} //pushCart
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
            {/* <Button type="primary" onClick={onSubmit} className="w-[580px] bg-orange-300">
              提交
            </Button> */}
          </Space>
        </div>
      </div>
    </Modal>
  );
};

export default DetailModal;
