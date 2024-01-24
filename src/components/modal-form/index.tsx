import { Modal, Form, Input } from 'antd';

const ModalForm = ({ state, visible, onSave, onCancel }: any) => {

  const [form] = Form.useForm();

  form.setFieldsValue({
    label: state.label,
    id: state.id,
  })

  return (
    <Modal
      open={visible}
      title="新增/编辑餐桌"
      okText="確認"
      cancelText="取消"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onSave({ ...values, id: state.id });
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
          label="餐桌名稱"
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

export default ModalForm;