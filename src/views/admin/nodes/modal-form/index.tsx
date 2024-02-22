import { useEffect } from "react";
import { Modal, Form, Input } from "antd";

interface ModalFormProps {
  state: any;
  visible: boolean;
  onSave: (values: any) => void;
  onCancel: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({ state, visible, onSave, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: state.name,
      description: state.description,
    });
  }, [state?.name]);

  return (
    <Modal
      open={visible}
      title="新增節點"
      okText="確認"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onSave({ ...values });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="name"
          label="節點名稱"
          rules={[
            {
              required: true,
              message: "請輸入節點名稱",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
          rules={[
            {
              required: true,
              message: "請輸入節點信息",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
