import { useEffect, useState, useMemo } from "react";
import { Row, Col, Input, Select, Empty, Spin, Typography } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getItems } from "@/api/items";
import DishCard from "@/components/DishCard";

const { Title } = Typography;

const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    getItems()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = items.filter((i) =>
      i.name.toLowerCase().includes(keyword.toLowerCase())
    );
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [items, keyword, sort]);

  return (
    <>
      <Title level={3}>Our Menu</Title>
      <div style={{ display: "flex", gap: 12, marginBottom: 24, maxWidth: 600 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Search dishes..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          size="large"
          allowClear
        />
        <Select
          value={sort}
          onChange={setSort}
          size="large"
          style={{ width: 160 }}
          options={[
            { value: "default", label: "Default" },
            { value: "name", label: "Name A-Z" },
            { value: "price-asc", label: "Price Low-High" },
            { value: "price-desc", label: "Price High-Low" },
          ]}
        />
      </div>

      {loading ? (
        <Spin size="large" />
      ) : filtered.length === 0 ? (
        <Empty description="No dishes found" />
      ) : (
        <Row gutter={[24, 24]}>
          {filtered.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item._id}>
              <DishCard item={item} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Menu;
