import { useEffect } from "react";
import { Modal, Form, InputNumber } from "antd";
import { SpaceTable } from "types/food";

interface TableModalFormProps {
  visible: boolean;
  onSave: (table: SpaceTable) => void;
  onCancel: () => void;
}

const ModalForm: React.FC<TableModalFormProps> = ({ visible, onSave, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={visible}
      title="輸入金額"
      okText="確認打印"
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
          name="amount"
          label="金額"
          rules={[
            {
              required: true,
              message: "請輸入訂單金額",
            },
          ]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalForm;
