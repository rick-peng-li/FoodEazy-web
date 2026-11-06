import { useEffect, useState } from "react";
import { Card, List, Typography, Tag, Empty, Spin } from "antd";
import { getMyOrders } from "@/api/order";

const { Title, Text } = Typography;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Title level={3}>My Orders</Title>
      {loading ? (
        <Spin size="large" />
      ) : orders.length === 0 ? (
        <Empty description="No orders yet" />
      ) : (
        <List
          dataSource={orders}
          renderItem={(order) => (
            <List.Item>
              <Card style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <Text strong>Order ID: {order.order_id}</Text>
                    <div>
                      <Tag color="blue">{order.mode}</Tag>
                      <Tag color="purple">{order.payment}</Tag>
                      <Tag color={order.status === "success" ? "green" : "orange"}>{order.status}</Tag>
                    </div>
                  </div>
                  <Text strong style={{ fontSize: 18 }}>₹ {order.order?.total_price}</Text>
                </div>
                <List
                  size="small"
                  dataSource={order.order?.items || []}
                  renderItem={(item) => (
                    <List.Item>
                      <Text>{item.name} x {item.q}</Text>
                      <Text>₹ {item.price * item.q}</Text>
                    </List.Item>
                  )}
                />
                {order.address && (
                  <Text type="secondary">
                    Deliver to: {order.address.house}, {order.address.area}, {order.address.city} - {order.address.pincode}
                  </Text>
                )}
              </Card>
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default Orders;
