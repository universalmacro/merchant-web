/* eslint-disable */
import * as YAML from "yaml";
import { Modal } from "antd";

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
    link.download = `${record.id}.json`;
    link.click();
  };

  return (
    <>
      <span
        className={`cursor-pointer text-cyan-400 ${className} `}
        onClick={(e: any) => {
          e.stopPropagation();
          handleDownload(record);
        }}
      >
        下載
      </span>
    </>
  );
};

export default ExportBtn;
