import { useEffect, useState } from "react";
import { Result, Button, Card, List, Typography, Spin } from "antd";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getOrderById } from "@/api/order";

const { Title, Text } = Typography;

const Success = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const orderid = params.get("orderid");

  useEffect(() => {
    if (orderid) getOrderById(orderid).then(setOrder).catch(() => setOrder(null));
  }, [orderid]);

  return (
    <>
      <Result status="success" title="Order Placed Successfully!" subTitle={`Order ID: ${orderid || "-"}`} />
      {order ? (
        <Card style={{ maxWidth: 640, margin: "0 auto" }}>
          <Title level={4}>Order Summary</Title>
          <Text type="secondary">Customer: {order.user?.name} ({order.user?.email})</Text>
          <List
            dataSource={order.order?.items || []}
            renderItem={(item) => (
              <List.Item>
                <Text>{item.name} x {item.q}</Text>
                <Text>₹ {item.price * item.q}</Text>
              </List.Item>
            )}
          />
          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Text strong style={{ fontSize: 18 }}>Total: ₹ {order.order?.total_price}</Text>
          </div>
          <div style={{ textAlign: "center", marginTop: 16 }}>
            <Button type="primary" onClick={() => navigate("/order")}>View My Orders</Button>
          </div>
        </Card>
      ) : (
        <Spin />
      )}
    </>
  );
};

export default Success;
