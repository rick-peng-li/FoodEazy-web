import { List, Empty, Typography, Button, Divider, Space } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useCartStore from "@/store/cart";
import CartItem from "@/components/CartItem";

const { Title, Text } = Typography;

const Cart = () => {
  const { items, total_price, total_quantity, clear } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Your cart is empty"
      >
        <Button type="primary" onClick={() => navigate("/")}>
          Browse Menu
        </Button>
      </Empty>
    );
  }

  return (
    <>
      <Title level={3}>
        <ShoppingCartOutlined /> My Cart ({total_quantity})
      </Title>
      <List itemLayout="horizontal" dataSource={items} renderItem={(item) => <CartItem item={item} />} />
      <Divider />
      <Space style={{ float: "right" }} size="large">
        <Text strong style={{ fontSize: 18 }}>Total: ₹ {total_price}</Text>
        <Button danger onClick={clear}>Clear Cart</Button>
        <Button type="primary" size="large" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </Button>
      </Space>
    </>
  );
};

export default Cart;
