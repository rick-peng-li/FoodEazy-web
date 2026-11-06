import { useState } from "react";
import { Card, Form, Input, InputNumber, Select, Button, Upload, message, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { addProduct } from "@/api/admin";

const { Title } = Typography;

const AddProduct = () => {
  const [form] = Form.useForm();
  const [file, setFile] = useState(null);

  const props = {
    beforeUpload: (f) => {
      setFile(f);
      return false;
    },
    maxCount: 1,
  };

  const onSubmit = async (values) => {
    if (!file) {
      message.error("Please upload an image");
      return;
    }
    const data = new FormData();
    data.append("productImage", file);
    data.append("name", values.name);
    data.append("price", values.price);
    data.append("type", values.type);
    try {
      await addProduct(data);
      message.success("Dish added successfully");
      form.resetFields();
      setFile(null);
    } catch (e) {
      message.error(e.message || "Failed to add dish");
    }
  };

  return (
    <Card style={{ maxWidth: 560, margin: "0 auto" }}>
      <Title level={3}>Add New Dish</Title>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input size="large" placeholder="Dish name" />
        </Form.Item>
        <Form.Item name="price" label="Price (₹)" rules={[{ required: true }]}>
          <InputNumber min={1} size="large" style={{ width: "100%" }} placeholder="Price" />
        </Form.Item>
        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
          <Select
            size="large"
            options={[
              { value: "Veg", label: "Veg" },
              { value: "nonVeg", label: "Non-Veg" },
            ]}
          />
        </Form.Item>
        <Form.Item label="Image">
          <Upload {...props} accept="image/*">
            <Button icon={<UploadOutlined />}>Select Image</Button>
          </Upload>
        </Form.Item>
        <Button type="primary" htmlType="submit" size="large" block>
          Add Dish
        </Button>
      </Form>
    </Card>
  );
};

export default AddProduct;
