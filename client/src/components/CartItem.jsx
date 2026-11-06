import { List, Button, InputNumber, Typography, Space, Image } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import useCartStore from "@/store/cart";

const { Text } = Typography;

const CartItem = ({ item }) => {
  const updateQty = useCartStore((s) => s.updateQty);
  const remove = useCartStore((s) => s.remove);

  return (
    <List.Item
      actions={[
        <InputNumber
          key="qty"
          min={1}
          value={item.q}
          onChange={(v) => updateQty(item.name, v)}
        />,
        <Button
          key="del"
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => remove(item.name)}
        />,
      ]}
    >
      <List.Item.Meta
        avatar={<Image src={item.url} width={64} height={64} style={{ objectFit: "cover", borderRadius: 8 }} />}
        title={item.name}
        description={<Text strong>₹ {item.price}</Text>}
      />
      <Space>
        <Text strong>₹ {item.price * item.q}</Text>
      </Space>
    </List.Item>
  );
};

export default CartItem;
