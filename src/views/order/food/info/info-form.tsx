import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import EditAttribute from "./attribute";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Form, Input, InputNumber, Select, Switch, Upload, message, Modal } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import axios from "axios";

const InfoForm = ({ record, state, visible, onSave, onCancel, categoryOptions }: any) => {
  const [form] = Form.useForm();
  // const [categoryOptions, setCategoryOptions] = useState([]);
  // const [category, setCategory] = useState([]);
  const { userToken, basePath } =
    useSelector((state: any) => state.auth) || localStorage.getItem("userToken") || {};
  const navigate = useNavigate();
  const [attributes, setAttributes] = useState(record?.attributes || []);
  const [imageUrl, setImageUrl] = useState<string>();
  const [imageLoading, setImageLoading] = useState(false);
  const [defaultValue, setDefaultValue] = useState<any>(record);

  useEffect(() => {
    form.setFieldsValue({
      ...state,
    });
  }, [state?.id]);

  useEffect(() => {
    let transformPriceValue = {
      ...state,
      price: state?.price / 100,
      attributes: state?.attributes?.map((item: any) => ({
        ...item,
        options: item?.options?.map((o: any) => ({ ...o, extra: o.extra / 100 })),
      })),
    };
    console.log("================", record, transformPriceValue);
    setAttributes(transformPriceValue?.attributes);
    setImageUrl(state?.image ?? "");
    setDefaultValue(transformPriceValue);
  }, [state?.id]);

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
    // if (info.file.status === "done") {
    //   // setImageLoading(false);
    //   // Get this url from response in real world.
    //   getBase64(info.file.originFileObj as RcFile, (url) => {
    //     setImageLoading(false);
    //     setImageUrl(url);
    //   });
    // }
  };

  const onUpload = async ({ data, file, filename, onSuccess }: any) => {
    if (!state?.id) {
      return;
    }
    setImageLoading(true);
    const config = {
      // headers: getHeaders(),
      headers: {
        // contentType: "multipart/form-data; boundary=<calculated when request is sent>",
        Authorization: `Bearer ${userToken}`,
      },
    };
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData, file, filename);

    try {
      const res = await axios.put(`${basePath}/spaces/foods/${state?.id}/image`, formData, config);
      onSuccess(res, file);
      setImageLoading(false);
      setImageUrl(res?.data?.image);
    } catch (e) {
      console.log(e);
      setImageLoading(false);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {imageLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  useEffect(() => form.resetFields(), [defaultValue]);

  const getHeaders = () => {
    return {
      ContentType: "application/json;charset=UTF-8",
      Authorization: `Bearer ${userToken}`,
    };
  };

  const onUpdate = async () => {
    try {
      const values = await form.validateFields();
      let params = {
        ...values,
        categories: [values?.categories].flat(),
        description: values?.description ?? "",
        status:
          values.status === true || values.status === "AVAILABLE" ? "AVAILABLE" : "UNAVAILABLE",
        image: imageUrl ?? "",
        price: values?.price * 100,
        attributes: filterAttr(),
      };
      console.log(params);
      if (state?.id) {
        onSave({ ...params, id: state?.id });
      } else {
        onSave(params);
      }
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
    let attrNames: any = [];
    attributes?.map((item: any) => {
      if (item && item?.label) {
        let optionList: any = [];
        if (!attrNames.includes(item?.label)) {
          attrNames.push(item?.label);
          item?.options?.map((option: any) => {
            if (option && option?.label && !isEmpty(option?.extra)) {
              optionList.push({ ...option, extra: option?.extra * 100 });
            }
          });
          if (optionList?.length > 0) {
            list.push({ label: item?.label, options: optionList });
          }
        }
      }
    });
    return list;
  };

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Modal
        open={visible}
        title="新增/编辑 FOOD"
        okText="確認"
        cancelText="取消"
        onCancel={onCancel}
        bodyStyle={{ overflowY: "auto", maxHeight: "calc(100vh - 250px)" }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onUpdate();
              // form.resetFields();
            })
            .catch((info) => {
              console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          style={{ maxWidth: 600 }}
          initialValues={defaultValue}
        >
          <Form.Item
            label="名稱"
            name="name"
            rules={[{ required: true, message: "請輸入品項名稱" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input />
          </Form.Item>
          <Form.Item label="價錢" name="price" rules={[{ required: true, message: "請輸入價錢" }]}>
            <InputNumber min={0} max={9999} />
          </Form.Item>
          <Form.Item label="服務費" name="fixedOffset">
            <InputNumber min={0} max={100} />
          </Form.Item>
          <Form.Item
            label="分類"
            name="categories"
            rules={[{ required: true, message: "請輸入分類" }]}
          >
            <Select
              // mode="tags"
              showSearch
              placeholder="輸入分類"
              optionFilterProp="children"
              // onSearch={onSearch}
              filterOption={filterOption}
              options={categoryOptions ?? []}
            />
          </Form.Item>

          <Form.Item label="狀態" name="status" valuePropName="checked" initialValue={true}>
            <Switch
              checkedChildren="正常"
              unCheckedChildren="估空"
              defaultChecked
              className="bg-gray-300"
            />
          </Form.Item>
          {state?.id && (
            <Form.Item label="圖片">
              <Upload
                name="data"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                customRequest={onUpload}
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
          )}
          <EditAttribute
            initValues={defaultValue?.attributes}
            onChange={(values: any) => {
              setAttributes(values);
            }}
          />
        </Form>
      </Modal>
    </>
  );
};

export default InfoForm;
