import { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";

interface ModalFormProps {
  state: any;
  visible: boolean;
  onSave: (values: any) => void;
  onCancel: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ state, visible, onSave, onCancel }) => {
  const [inputValue, setInputValue] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("ModalForm-useEffect", state);
    form.setFieldsValue({
      account: state?.account ?? "",
      password: state?.password ?? "",
      role: state?.role ?? "ADMIN",
    });
  }, [state?.account]);

  const onChange = (newValue: number) => {
    setInputValue(newValue);
  };

  return (
    <Modal
      open={visible}
      title="新增管理員"
      okText="確認"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onSave({ ...state, ...values });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="account"
          label="賬號"
          rules={[
            {
              required: true,
              message: "請輸入賬號",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="密碼"
          rules={[
            {
              required: true,
              message: "請輸入密碼",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="role" label="類型">
          <Select
            disabled
            defaultValue="ADMIN"
            style={{ width: 120 }}
            options={[{ value: "ADMIN", label: "管理員" }]}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
