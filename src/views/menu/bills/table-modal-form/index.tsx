import { useEffect } from "react";
import { Modal, Form, Select } from "antd";
import { SpaceTable } from "types/food";

interface TableModalFormProps {
  options: any[];
  visible: boolean;
  onSave: (table: SpaceTable) => void;
  onCancel: () => void;
}

const TableModalForm: React.FC<TableModalFormProps> = ({ options, visible, onSave, onCancel }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      open={visible}
      title="更換訂單桌號"
      okText="確認"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            form.resetFields();
            onSave(values);
            // onSave({ ...values, id: state.id });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="label"
          label="餐桌名稱"
          rules={[
            {
              required: true,
              message: "請選擇",
            },
          ]}
        >
          <Select style={{ width: 120 }} options={options} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TableModalForm;
