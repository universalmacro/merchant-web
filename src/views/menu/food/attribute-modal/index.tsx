import { useEffect, useState } from "react";
import { Modal, Radio, Select, Tag } from "antd";
import { Food } from "@universalmacro/merchant-ts-sdk";
import type { RadioChangeEvent } from "antd";

interface AttributeModalProps {
  food: Food;
  visible: boolean;
  onSave: (item: Food, selectedOptions: Map<string, string>) => void;
  onCancel: () => void;
  printerOptions: any;
}

const AttributeModal: React.FC<AttributeModalProps> = ({
  food,
  visible,
  onSave,
  onCancel,
  printerOptions,
}) => {
  const specMap = new Map();

  const onChange = (e: RadioChangeEvent) => {
    const specification = e.target.value;
    specMap.set(specification?.attribute, specification?.optioned);
  };

  return (
    <Modal
      open={visible}
      title="選擇屬性"
      okText="加入購物車"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        // let spec: { attribute: any; optioned: any }[] = [];
        // specMap.forEach(function (value, key) {
        //   spec.push({ attribute: key, optioned: value });
        // });
        // onSave({ food: food, spec: spec });
        onSave(food, specMap);
        onCancel();
      }}
    >
      {food?.attributes?.map((attribute) => (
        <div className="" key={attribute.label}>
          <div className="mt-4">{attribute.label}</div>
          <div className="mt-2">
            <Radio.Group onChange={onChange}>
              {attribute.options.map((option, index) => (
                <Radio.Button
                  value={{ attribute: attribute.label, optioned: option.label }}
                  className="mr-2 mt-2"
                  // style={{ borderRadius: "4px" }}
                >
                  {option.label}
                  {option.extra ? "+" + option.extra / 100 + "$" : ""}
                </Radio.Button>
                // <Tag color="orange">
                //   {option.label}
                //   {option.extra ? "+" + option.extra / 100 + "$" : ""}
                // </Tag>
              ))}
            </Radio.Group>
          </div>
        </div>
      ))}
      {/* <Radio.Group onChange={onChange} defaultValue="a">
        <Radio.Button value="a">Hangzhou</Radio.Button>
        <Radio.Button value="b">Shanghai</Radio.Button>
        <Radio.Button value="c">Beijing</Radio.Button>
        <Radio.Button value="d">Chengdu</Radio.Button>
      </Radio.Group> */}
    </Modal>
  );
};

export default AttributeModal;
