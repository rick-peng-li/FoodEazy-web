import { Layout, Menu, Button, Badge, Typography, Space, Dropdown } from "antd";
import {
  HomeOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  UserOutlined,
  PlusSquareOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/auth";
import useCartStore from "@/store/cart";

const { Header, Content } = Layout;
const { Title } = Typography;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user, logout } = useAuthStore();
  const total_quantity = useCartStore((s) => s.total_quantity);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const userMenu = {
    items: [
      { key: "orders", icon: <OrderedListOutlined />, label: <Link to="/order">My Orders</Link> },
      { type: "divider" },
      {
        key: "logout",
        icon: <LogoutOutlined />,
        label: "Logout",
        onClick: handleLogout,
      },
    ],
  };

  const items = [
    { key: "/", icon: <HomeOutlined />, label: <Link to="/">Home</Link> },
    ...(token
      ? [
          {
            key: "/cart",
            icon: (
              <Badge count={total_quantity} size="small">
                <ShoppingCartOutlined />
              </Badge>
            ),
            label: <Link to="/cart">Cart</Link>,
          },
          { key: "/order", icon: <OrderedListOutlined />, label: <Link to="/order">Orders</Link> },
          ...(user?.role === "admin"
            ? [
                { key: "/addproduct", icon: <PlusSquareOutlined />, label: <Link to="/addproduct">Add Item</Link> },
                { key: "/deleteitems", icon: <DeleteOutlined />, label: <Link to="/deleteitems">Delete Item</Link> },
              ]
            : []),
          { key: "/contact", icon: <InfoCircleOutlined />, label: <Link to="/contact">Contact</Link> },
        ]
      : [{ key: "/contact", icon: <InfoCircleOutlined />, label: <Link to="/contact">Contact</Link> }]),
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: 24 }}>
        <Space>
          <Title level={4} style={{ color: "#fff", margin: 0, cursor: "pointer" }} onClick={() => navigate("/")}>
            🍔 Food Eazy
          </Title>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={items}
            style={{ background: "transparent", minWidth: 420 }}
          />
        </Space>
        <Space>
          {token ? (
            <Dropdown menu={userMenu} placement="bottomRight">
              <Button type="text" style={{ color: "#fff" }} icon={<UserOutlined />}>
                {user?.name || "Account"}
              </Button>
            </Dropdown>
          ) : (
            <Button type="primary" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </Space>
      </Header>
      <Content style={{ padding: 24 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
      </Content>
    </Layout>
  );
};

export default MainLayout;
