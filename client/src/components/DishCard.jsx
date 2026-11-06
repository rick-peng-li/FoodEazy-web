import { Card, Typography, Button, Tag, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import useCartStore from "@/store/cart";

const { Text } = Typography;

const DishCard = ({ item }) => {
  const add = useCartStore((s) => s.add);

  return (
    <Card
      hoverable
      cover={<img alt={item.name} src={item.url} style={{ height: 180, objectFit: "cover" }} />}
      actions={[
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => add({ name: item.name, price: item.price, url: item.url })}
        >
          Add
        </Button>,
      ]}
    >
      <Card.Meta
        title={
          <Space>
            <span>{item.name}</span>
            <Tag color={item.type === "Veg" ? "green" : "red"}>{item.type}</Tag>
          </Space>
        }
        description={<Text strong style={{ fontSize: 16 }}>₹ {item.price}</Text>}
      />
    </Card>
  );
};

export default DishCard;
