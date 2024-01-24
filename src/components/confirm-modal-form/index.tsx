import { Modal, Form, Input } from 'antd';

const ConfirmModalForm = ({ visible, onSave, onCancel }: any) => {

  const [form] = Form.useForm();

  return (
    <Modal
      open={visible}
      title="確認刪除餐廳？請輸入餐廳名稱"
      okText="確認"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onSave({ ...values });
          })
          .catch(info => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item
          name="label"
          label="餐廳名稱"
          rules={[
            {
              required: true,
              message: '請輸入餐廳名稱',
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ConfirmModalForm;