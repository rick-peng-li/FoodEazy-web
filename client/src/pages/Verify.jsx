import { useState } from "react";
import { Card, Form, Input, Button, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "@/api/auth";
import useAuthStore from "@/store/auth";

const { Title } = Typography;

const Verify = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();

  const onVerify = async (values) => {
    setLoading(true);
    try {
      await verifyEmail(values.uid);
      if (user) setUser({ ...user, verify: true });
      message.success("Email verified successfully");
      navigate("/");
    } catch (e) {
      message.error(e.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card style={{ width: 420 }}>
        <Title level={3}>Email Verification</Title>
        <Form layout="vertical" onFinish={onVerify}>
          <Form.Item name="uid" label="Verification Code" rules={[{ required: true }]}>
            <Input size="large" placeholder="Enter code from email" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={loading}>
            Verify
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Verify;
