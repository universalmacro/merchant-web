import React, { useEffect, useState } from "react";
import { CloseOutlined, DownCircleOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, InputNumber, Space, Typography } from "antd";

const EditAttribute = ({ initValues, onChange }: any) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initValues) {
      onChange(initValues);
    }
  }, []);

  useEffect(() => form.resetFields(), [initValues]);

  const onFormChange = () => {
    onChange(form.getFieldsValue()?.items);
  };

  return (
    <Form
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      form={form}
      name="dynamic_form_complex"
      style={{ maxWidth: 600 }}
      autoComplete="off"
      initialValues={{ items: initValues ?? [{}] }}
      onChange={onFormChange}
    >
      <Form.List name="items">
        {(fields, { add, remove, move }) => (
          <div style={{ display: "flex", rowGap: 16, flexDirection: "column" }}>
            {fields.map((field) => (
              <div
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <Card
                  style={{ width: "90%" }}
                  size="small"
                  title={`屬性 ${field.name + 1}`}
                  key={field.key}
                  extra={
                    <CloseOutlined
                      onClick={() => {
                        remove(field.name);
                        onChange(form.getFieldsValue()?.items);
                      }}
                    />
                  }
                >
                  <Form.Item label="屬性名稱" name={[field.name, "label"]}>
                    <Input />
                  </Form.Item>

                  {/* Nest Form.List */}
                  <Form.Item label="選項">
                    <Form.List name={[field.name, "options"]}>
                      {(subFields, subOpt) => (
                        <div style={{ display: "flex", flexDirection: "column", rowGap: 16 }}>
                          {subFields.map((subField) => (
                            <Space key={subField.key}>
                              <Form.Item noStyle name={[subField.name, "label"]}>
                                <Input placeholder="標籤" />
                              </Form.Item>
                              <Form.Item noStyle name={[subField.name, "extra"]}>
                                <InputNumber placeholder="額外價格" />
                              </Form.Item>
                              <CloseOutlined
                                onClick={() => {
                                  subOpt.remove(subField.name);
                                  onChange(form.getFieldsValue()?.items);
                                }}
                              />
                            </Space>
                          ))}
                          <Button type="dashed" onClick={() => subOpt.add()} block>
                            + 添加
                          </Button>
                        </div>
                      )}
                    </Form.List>
                  </Form.Item>
                </Card>
                <DownCircleOutlined
                  onClick={() => {
                    move(field.name, field.name + 1);
                    console.log("================onFormChange", form.getFieldsValue()?.items);

                    onChange(form.getFieldsValue()?.items);
                  }}
                />
              </div>
            ))}

            <Button type="dashed" onClick={() => add()} block>
              + 添加屬性
            </Button>
          </div>
        )}
      </Form.List>
      {/* <Form.Item noStyle shouldUpdate>
        {() => (
          <Typography>
            <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
          </Typography>
        )}
      </Form.Item> */}
    </Form>
  );
};

export default EditAttribute;
