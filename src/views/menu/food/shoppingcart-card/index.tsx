import { useState, useEffect } from "react";
import { Table, Card, Modal, message, Tag } from "antd";

import { Food, FoodSpec } from "@universalmacro/merchant-ts-sdk";
import { defaultImage } from "utils/constant";
import { CartItem } from "../index";

interface ShoppingCartCardProps {
  item: CartItem;
  onClick?: () => void;
  onCancel?: () => void;
}

const ShoppingCartCard: React.FC<ShoppingCartCardProps> = ({ item, onClick }) => {
  return (
    <Card onClick={onClick} bordered={false} bodyStyle={{ padding: "10px" }}>
      <div className="flex justify-between">
        <div className="flex">
          <img
            className="p-2"
            alt="example"
            style={{ maxHeight: "90px", overflow: "hidden" }}
            src={
              item?.food?.image
                ? `${item?.food?.image}?imageView2/1/w/268/q/85`
                : `${defaultImage}?imageView2/1/w/268/q/85`
            }
          />
          {/* <div className="flex justify-between"> */}
          <div className="flex flex-col p-2">
            <p className="text-base font-bold">{item.food.name}</p>
            <span className="text-sm">
              {item.spec.map((i: any) => {
                return <>{`${i.attribute}: ${i.optioned}; `}</>;
              })}
            </span>
            <p className="text-lg text-red-600">${item.food.price / 100}</p>
          </div>
        </div>
        <p> {item.amount}</p>
        {/* </div> */}
      </div>
    </Card>
  );
};

export default ShoppingCartCard;
