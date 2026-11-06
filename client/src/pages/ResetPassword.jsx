import { useEffect, useState } from "react";
import { Card, Form, Input, Button, Typography, message, Alert } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { checkResetCode, resetPassword } from "@/api/auth";

const { Title } = Typography;

const ResetPassword = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [valid, setValid] = useState(null);

  useEffect(() => {
    checkResetCode(code)
      .then(() => setValid(true))
      .catch(() => setValid(false));
  }, [code]);

  const onSubmit = async (values) => {
    try {
      await resetPassword(code, values.password);
      message.success("Password reset successfully");
      navigate("/auth");
    } catch (e) {
      message.error(e.message || "Failed");
    }
  };

  if (valid === false) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Card style={{ width: 420 }}>
          <Alert type="error" message="Invalid or expired reset link" />
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Card style={{ width: 420 }}>
        <Title level={3}>Reset Password</Title>
        <Form layout="vertical" onFinish={onSubmit}>
          <Form.Item name="password" rules={[{ required: true, min: 6 }]}>
            <Input.Password size="large" placeholder="New Password" />
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
            <Input.Password size="large" placeholder="Confirm Password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Reset Password
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default ResetPassword;
