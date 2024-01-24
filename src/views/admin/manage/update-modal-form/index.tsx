import { useEffect, useState } from "react";
import { Modal, Form, Input, Select } from "antd";

interface ModalFormProps {
  state: any;
  visible: boolean;
  onSave: (values: any) => void;
  onCancel: () => void;
}

const UpdateModalForm: React.FC<ModalFormProps> = ({ state, visible, onSave, onCancel }) => {
  const [inputValue, setInputValue] = useState(0);
  const [form] = Form.useForm();
  console.log(state);

  return (
    <Modal
      open={visible}
      title="更新密碼"
      okText="確認"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onSave({ ...values, id: state?.id });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
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
      </Form>
    </Modal>
  );
};

export default UpdateModalForm;
