import { Card, Form, Input, Button, Typography, message } from "antd";
import { forgetPassword } from "@/api/auth";

const { Title, Paragraph } = Typography;

const Forget = () => {
  const onSubmit = async (values) => {
    try {
      await forgetPassword(values.email);
      message.success("Reset link sent to your email");
    } catch (e) {
      message.error(e.message || "Failed");
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card style={{ width: 420 }}>
        <Title level={3}>Forgot Password</Title>
        <Paragraph>Enter your email and we'll send you a reset link.</Paragraph>
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item name="email" rules={[{ required: true, type: "email" }]}>
            <Input size="large" placeholder="Email" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Send Reset Link
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Forget;
