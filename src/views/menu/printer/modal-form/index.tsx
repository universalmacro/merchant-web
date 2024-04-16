import { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";
import { Printer } from "types/food";

interface PrinterModalFormProps {
  state: Printer;
  visible: boolean;
  onSave: (printer: Printer) => void;
  onCancel: () => void;
}

const PrinterModalForm: React.FC<PrinterModalFormProps> = ({
  state,
  visible,
  onSave,
  onCancel,
}) => {
  const [inputValue, setInputValue] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("PrinterModalForm-useEffect", state);
    form.setFieldsValue({
      id: state?.id,
      name: state?.name,
      sn: state?.sn,
      model: state?.model ?? "F58MM",
      type: state?.type ?? "CASHIER",
    });
  }, [state?.id]);

  const onChange = (newValue: number) => {
    setInputValue(newValue);
  };

  return (
    <Modal
      open={visible}
      title="新增/编辑打印機"
      okText="確認"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onSave({ ...state, ...values });
            form.resetFields();
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="name"
          label="打印機名稱"
          rules={[
            {
              required: true,
              message: "請輸入折扣名稱",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="sn"
          label="SN編號"
          rules={[
            {
              required: true,
              message: "請輸入SN編號",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="type" label="模型">
          <Select
            defaultValue="CASHIER"
            style={{ width: 120 }}
            options={[
              { value: "CASHIER", label: "CASHIER" },
              { value: "KITCHEN", label: "KITCHEN" },
            ]}
          />
        </Form.Item>
        <Form.Item name="model" label="型號">
          <Select
            defaultValue="F58MM"
            style={{ width: 120 }}
            options={[
              { value: "F58MM", label: "F58MM" },
              { value: "F80MM", label: "F80MM" },
            ]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PrinterModalForm;
