import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../../features/auth/authActions";
import EditAttribute from "./attribute";
import { AppDispatch } from "../../store";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  TreeSelect,
  Upload,
  message,
} from "antd";
import { restaurantApi, createItem, updateItem, getPrinters, restaurantBasePath } from "api";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";

const InfoForm = ({ record }: any) => {
  const [form] = Form.useForm();
  const { restaurantList, restaurantId, restaurantInfo } =
    useSelector((state: any) => state.restaurant) || {};
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [category, setCategory] = useState([]);
  const dispatch = useDispatch<AppDispatch>();
  const { userToken } =
    useSelector((state: any) => state.auth) || localStorage.getItem("merchant-web-token") || {};
  const navigate = useNavigate();
  const [printerData, setPrinterData] = useState([]);
  const [attributes, setAttributes] = useState(record?.attributes || []);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);
  const [defaultValue, setDefaultValue] = useState<any>(record);

  const { RangePicker } = DatePicker;
  const { TextArea } = Input;

  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    if (!record?.id) return;
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const handleImageChange: UploadProps["onChange"] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === "uploading") {
      setImageLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setImageLoading(false);
        setImageUrl(url);
      });
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const getPrinterList = async () => {
    if (!restaurantId) return;
    try {
      let params = {
        headers: getHeaders(),
      };
      const res = await getPrinters(restaurantId, params);
      setPrinterData(res);
    } catch (e) {}
  };

  useEffect(() => {
    getPrinterList();
  }, [restaurantId]);

  useEffect(() => form.resetFields(), [defaultValue]);

  const getHeaders = () => {
    return {
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${userToken}`,
    };
  };

  useEffect(() => {
    let options: any = [];
    restaurantInfo?.categories?.map((e: any) => {
      options.push({ value: e, label: e });
    });
    console.log(options);
    setCategoryOptions(options);
  }, [restaurantInfo?.categories?.length]);

  useEffect(() => {
    let transformPriceValue = {
      ...record,
      pricing: record?.pricing / 100,
      attributes: record?.attributes?.map((item: any) => ({
        ...item,
        options: item?.options?.map((o: any) => ({ ...o, extra: o.extra / 100 })),
      })),
    };
    console.log("=================transformPriceValue", transformPriceValue);
    setDefaultValue(transformPriceValue);
  }, []);

  const onCheck = async () => {
    try {
      const values = await form.validateFields();

      console.log("onCheck:", values, attributes);

      let params = {
        ...values,
        status: values.status === true ? "ACTIVED" : "DEACTIVED",
        images: [],
        pricing: values.pricing * 100,
        attributes: filterAttr(),
      };

      try {
        const res = await createItem(restaurantId, params, {
          headers: getHeaders(),
        });
        navigate("/admin/item");
      } catch (e) {}

      console.log(params);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const onUpdate = async () => {
    try {
      const values = await form.validateFields();
      console.log("onUpdate:", values, attributes);
      let params = {
        ...values,
        status: values.status === true || values.status === "ACTIVED" ? "ACTIVED" : "DEACTIVED",
        images: imageUrl ? [imageUrl] : [],
        pricing: values.pricing * 100,
        attributes: filterAttr(),
      };
      console.log(params);

      try {
        const res = await updateItem(record?.id, params, {
          headers: getHeaders(),
        });
        navigate("/admin/item");
      } catch (e) {}
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const isEmpty = (obj: any) => {
    if (obj === undefined || obj === null) return true;
    return false;
  };

  const filterAttr = () => {
    let list: any = [];
    attributes?.map((item: any) => {
      if (item && item?.label) {
        let optionList: any = [];
        item?.options?.map((option: any) => {
          if (option && option?.label && !isEmpty(option?.extra)) {
            optionList.push({ ...option, extra: option?.extra * 100 });
          }
        });
        if (optionList?.length > 0) {
          list.push({ label: item?.label, options: optionList });
        }
      }
    });
    return list;
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const printerOptions = printerData?.filter((o: any) => !selectedItems.includes(o.name));

  return (
    <>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}
        initialValues={defaultValue}
      >
        <Form.Item label="名稱" name="name" rules={[{ required: true, message: "請輸入品項名稱" }]}>
          <Input />
        </Form.Item>
        <Form.Item label="價錢" name="pricing" rules={[{ required: true, message: "請輸入價錢" }]}>
          <InputNumber />
        </Form.Item>
        <Form.Item label="分類" name="tags" rules={[{ required: true, message: "請輸入分類" }]}>
          <Select
            mode="tags"
            showSearch
            placeholder="輸入分類"
            optionFilterProp="children"
            // onSearch={onSearch}
            filterOption={filterOption}
            options={categoryOptions}
          />
        </Form.Item>
        <Form.Item
          label="打印機"
          name="printers"
          rules={[{ required: true, message: "請選擇打印機" }]}
        >
          <Select
            mode="multiple"
            placeholder="請選擇打印機"
            value={selectedItems}
            onChange={setSelectedItems}
            style={{ width: "100%" }}
            options={printerOptions.map((item) => ({
              value: item.id,
              label: item.name,
            }))}
          />
        </Form.Item>

        <Form.Item label="狀態" name="status" valuePropName="checked" initialValue={true}>
          <Switch checkedChildren="正常" unCheckedChildren="估空" defaultChecked />
        </Form.Item>
        <Form.Item label="圖片">
          <Upload
            name="data"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={`${restaurantBasePath}/items/${record?.id}/image`}
            headers={{
              Authorization: `Bearer ${userToken}`,
            }}
            beforeUpload={beforeUpload}
            onChange={handleImageChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </Form.Item>
        <EditAttribute
          initValues={defaultValue?.attributes}
          onChange={(values: any) => {
            setAttributes(values);
          }}
        />
        <Form.Item>
          <Button className="mr-4 mt-4" type="primary" onClick={() => navigate("/admin/item")}>
            取消
          </Button>
          <Button className="mt-4" type="primary" onClick={record ? onUpdate : onCheck}>
            確認
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default InfoForm;
