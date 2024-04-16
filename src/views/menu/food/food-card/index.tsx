import { useState, useEffect } from "react";
import { Table, Card, Modal, message, Tag } from "antd";

import {
  OrderApi,
  Configuration,
  ConfigurationParameters,
  SpaceApi,
  Food,
} from "@universalmacro/merchant-ts-sdk";
import { defaultImage } from "utils/constant";

interface FoodCardProps {
  item: Food;
  onClick?: () => void;
  onCancel?: () => void;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onClick }) => {
  return (
    <div>
      <Card
        onClick={onClick}
        hoverable
        style={{ width: "180px" }}
        cover={
          <img
            className="p-4"
            alt="example"
            style={{ maxHeight: "180px", overflow: "hidden" }}
            src={
              item.image
                ? `${item.image}?imageView2/1/w/268/q/85`
                : `${defaultImage}?imageView2/1/w/268/q/85`
            }
          />
        }
      >
        <div className="flex items-center justify-between">
          <span className="font-bold">{item.name}</span>
          <span className="text-red-500">${item.price / 100}</span>
        </div>
      </Card>
    </div>
  );
};

export default FoodCard;
