/* eslint-disable */
import * as YAML from "yaml";
import { Button, Modal } from "antd";
import { ExportOutlined } from "@ant-design/icons";

const ExportBtn = ({ record, className = "" }: any) => {
  const errorCallback = () => {
    Modal.error({
      content: "無法獲取配置信息",
    });
  };

  const handleDownload = (record: any) => {
    if (!record) {
      errorCallback();
    }

    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(record))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `allfood.json`;
    link.click();
  };

  return (
    <>
      <Button
        style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
        onClick={(e: any) => {
          e.stopPropagation();
          handleDownload(record);
        }}
      >
        <ExportOutlined />
        導出
      </Button>
      {/* <span
        className={`cursor-pointer text-cyan-400 ${className} `}
        onClick={(e: any) => {
          e.stopPropagation();
          handleDownload(record);
        }}
      >
        下載
      </span> */}
    </>
  );
};

export default ExportBtn;
