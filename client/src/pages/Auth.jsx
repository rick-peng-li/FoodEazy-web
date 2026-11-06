import { useState } from "react";
import { Card, Form, Input, Button, Tabs, Typography, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useAuthStore from "@/store/auth";

const { Title, Text } = Typography;

const Auth = () => {
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuthStore();

  const onLogin = async (values) => {
    setLoading(true);
    try {
      await login(values);
      message.success("Logged in successfully");
      navigate("/");
    } catch (e) {
      message.error(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values) => {
    setLoading(true);
    try {
      await register(values);
      message.success("Registered successfully");
      navigate("/");
    } catch (e) {
      message.error(e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#fa8c16,#f5222d)" }}>
      <Card style={{ width: 420 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          🍔 Food Eazy
        </Title>
        <Tabs activeKey={tab} onChange={setTab} centered items={[
          { key: "login", label: "Sign In" },
          { key: "register", label: "Sign Up" },
        ]} />

        {tab === "login" ? (
          <Form layout="vertical" onFinish={onLogin}>
            <Form.Item name="email" rules={[{ required: true, message: "Email is required" }]}>
              <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Password is required" }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Login
            </Button>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Button type="link" onClick={() => navigate("/forget")}>Forgot password?</Button>
            </div>
          </Form>
        ) : (
          <Form layout="vertical" onFinish={onRegister}>
            <Form.Item name="name" rules={[{ required: true }]}>
              <Input prefix={<UserOutlined />} placeholder="Name" size="large" />
            </Form.Item>
            <Form.Item name="email" rules={[{ required: true, type: "email" }]}>
              <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
            </Form.Item>
            <Form.Item name="number" rules={[{ required: true }]}>
              <Input prefix={<PhoneOutlined />} placeholder="Phone Number" size="large" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, min: 6 }]}>
              <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) return Promise.resolve();
                    return Promise.reject(new Error("Passwords do not match"));
                  },
                }),
              ]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Confirm Password" size="large" />
            </Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}>
              Register
            </Button>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Auth;
