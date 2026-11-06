import { useState } from "react";
import {
  Card,
  Form,
  Input,
  Radio,
  Button,
  Typography,
  Divider,
  message,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import useCartStore from "@/store/cart";
import useAuthStore from "@/store/auth";
import { createOrder, payWithPaytm } from "@/api/order";

const { Title, Text } = Typography;

const DELIVERY_FEE = 30;

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("Takeaway");
  const [payment, setPayment] = useState("Cash on Delivery");
  const navigate = useNavigate();
  const { items, total_price, total_quantity } = useCartStore();
  const { user } = useAuthStore();

  const deliveryCharges = mode === "Delivery" ? DELIVERY_FEE : 0;
  const grandTotal = total_price + deliveryCharges;

  const submit = async (values) => {
    if (items.length === 0) {
      message.warning("Your cart is empty");
      return;
    }
    setLoading(true);
    try {
      if (payment === "PayTM") {
        const html = await payWithPaytm({ amount: grandTotal });
        const win = window.open("", "_blank");
        win.document.write(html);
        win.document.close();
        return;
      }

      const res = await createOrder({
        value: mode,
        cart: { items, total_quantity, total_price },
        deliveryCharges,
        payment,
        user: { name: user?.name, email: user?.email },
        address: values,
      });
      message.success("Order placed successfully!");
      navigate(`/success?orderid=${res.orderid}`);
    } catch (e) {
      message.error(e.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title level={3}>Checkout</Title>
      <Form layout="vertical" onFinish={submit} style={{ maxWidth: 640 }}>
        <Card title="Delivery Method" style={{ marginBottom: 16 }}>
          <Radio.Group value={mode} onChange={(e) => setMode(e.target.value)}>
            <Radio value="Takeaway">Takeaway</Radio>
            <Radio value="Delivery">Delivery (+ ₹{DELIVERY_FEE})</Radio>
          </Radio.Group>
        </Card>

        {mode === "Delivery" && (
          <Card title="Delivery Address" style={{ marginBottom: 16 }}>
            <Form.Item name="house" label="House / Flat No" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="area" label="Area / Street" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="city" label="City" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="pincode" label="Pincode" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Card>
        )}

        <Card title="Payment Method" style={{ marginBottom: 16 }}>
          <Radio.Group value={payment} onChange={(e) => setPayment(e.target.value)}>
            <Radio value="Cash on Delivery">Cash on Delivery</Radio>
            <Radio value="PayTM">PayTM (Online)</Radio>
          </Radio.Group>
        </Card>

        <Card>
          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Items Total</Text>
              <Text>₹ {total_price}</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Delivery Charges</Text>
              <Text>₹ {deliveryCharges}</Text>
            </div>
            <Divider style={{ margin: "8px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong style={{ fontSize: 18 }}>Grand Total</Text>
              <Text strong style={{ fontSize: 18 }}>₹ {grandTotal}</Text>
            </div>
          </Space>
          <Divider />
          <Button type="primary" size="large" block htmlType="submit" loading={loading}>
            Place Order
          </Button>
        </Card>
      </Form>
    </>
  );
};

export default Checkout;
