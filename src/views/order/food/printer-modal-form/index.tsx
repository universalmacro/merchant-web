import { useEffect } from "react";
import { Modal, Form, Select } from "antd";

interface TableModalFormProps {
  state: any;
  visible: boolean;
  onSave: (value: any) => void;
  onCancel: () => void;
  printerOptions: any;
}

const PrinterModalForm: React.FC<TableModalFormProps> = ({
  state,
  visible,
  onSave,
  onCancel,
  printerOptions,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      printers: state?.printers,
      id: state?.id,
    });
  }, [state?.id]);

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
            form.resetFields();
            onSave({ ...values, id: state.id });
          })
          .catch((info) => {
            console.log("Validate Failed:", info);
          });
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item name="printers" label="打印機">
          <Select
            mode="multiple"
            allowClear
            style={{ width: "100%" }}
            placeholder="請選擇打印機"
            options={printerOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PrinterModalForm;
