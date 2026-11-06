import { useEffect, useState } from "react";
import { Card, List, Button, Popconfirm, message, Typography, Empty } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { getAdminItems, deleteProduct } from "@/api/admin";

const { Title } = Typography;

const DeleteItems = () => {
  const [items, setItems] = useState([]);

  const load = () => getAdminItems().then(setItems).catch(() => setItems([]));

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (name) => {
    try {
      await deleteProduct(name);
      message.success("Deleted");
      load();
    } catch (e) {
      message.error(e.message || "Failed");
    }
  };

  return (
    <Card style={{ maxWidth: 720, margin: "0 auto" }}>
      <Title level={3}>Delete Dishes</Title>
      {items.length === 0 ? (
        <Empty />
      ) : (
        <List
          dataSource={items}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Popconfirm
                  title="Delete this dish?"
                  onConfirm={() => handleDelete(item.name)}
                  okText="Delete"
                  cancelText="Cancel"
                >
                  <Button danger icon={<DeleteOutlined />}>Delete</Button>
                </Popconfirm>,
              ]}
            >
              <List.Item.Meta
                avatar={<img src={item.url} alt={item.name} style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8 }} />}
                title={item.name}
                description={`₹ ${item.price} · ${item.type}`}
              />
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default DeleteItems;
