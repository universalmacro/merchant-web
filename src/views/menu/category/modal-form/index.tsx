import { useEffect } from "react";
import { Modal, Form, Input } from "antd";

interface TableModalFormProps {
  state: any;
  visible: boolean;
  onSave: (table: any) => void;
  onCancel: () => void;
}

const ModalForm: React.FC<TableModalFormProps> = ({ state, visible, onSave, onCancel }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: state?.name,
      id: state?.id,
    });
  }, [state?.name]);

  return (
    <Modal
      open={visible}
      title="新增/编辑分類"
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
          name="name"
          label="名稱 (可以使用中英文逗號，空格分割)"
          rules={[
            {
              required: true,
              message: "請輸入名稱",
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
