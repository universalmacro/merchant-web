import { useState, useMemo } from "react";
import { Table, Card, Modal, message, Tag } from "antd";
import reducePngUrl from "../../../../assets/png/reduce.png";
import addPngUrl from "../../../../assets/png/add.png";
import { Food, FoodSpec } from "@universalmacro/merchant-ts-sdk";
import { defaultImage } from "utils/constant";
import { CartItem } from "../index";
import { CartOrder, PairToMap, getPricing } from "utils/utils";

interface ShoppingCartCardProps {
  item: CartOrder;
  onClick?: () => void;
  onCancel?: () => void;
  pushCart: (item: Food, selectedOptions: Map<string, string>) => void;
  removeCart: (item: Food, selectedOptions: Map<string, string>) => void;
}

const ShoppingCartCard: React.FC<ShoppingCartCardProps> = ({
  item,
  onClick,
  pushCart,
  removeCart,
}) => {
  const pricing = useMemo(() => {
    return getPricing(item.order);
  }, [item.order.spec]);

  return (
    <Card onClick={onClick} bordered={false} bodyStyle={{ padding: "10px" }}>
      <div className="flex items-center justify-between">
        <div className="flex">
          <img
            className="p-2"
            alt="example"
            style={{ maxHeight: "90px", overflow: "hidden" }}
            src={
              item?.order?.food?.image
                ? `${item?.order?.food?.image}?imageView2/1/w/268/q/85`
                : `${defaultImage}?imageView2/1/w/268/q/85`
            }
          />
          <div className="flex flex-col p-2">
            <p className="text-base font-bold">{item?.order?.food.name}</p>
            <span className="text-sm">
              {item?.order?.spec?.map((i: any) => {
                return <>{`${i.attribute}: ${i.optioned}; `}</>;
              })}
            </span>
            {/* <p className="text-lg text-red-600">${item?.order?.food.price / 100}</p> */}
            <p className="text-lg text-red-600">${pricing / 100}</p>
          </div>
        </div>
        <div className="flex items-center">
          <img
            className="mr-2 h-[20px] w-[20px] cursor-pointer"
            onClick={() => removeCart(item?.order?.food, PairToMap(item?.order?.spec))}
            src={reducePngUrl}
            alt="减"
          />
          <div className="action-normal-number">{item.amount}</div>
          <img
            className="ml-2 h-[20px] w-[20px] cursor-pointer"
            onClick={() => pushCart(item?.order?.food, PairToMap(item?.order?.spec))}
            src={addPngUrl}
            alt="加"
          />
        </div>
      </div>
    </Card>
  );
};

export default ShoppingCartCard;
