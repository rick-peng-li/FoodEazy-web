import { Card, Typography, Space, Avatar } from "antd";
import { MailOutlined, GithubOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;

const Contact = () => {
  return (
    <Card style={{ maxWidth: 720, margin: "0 auto" }}>
      <Title level={3}>About Food Eazy</Title>
      <Paragraph>
        Food Eazy is an online food ordering platform that lets you browse dishes,
        add them to your cart, choose delivery or takeaway, and place orders in
        minutes. Admins can manage the menu by adding or removing dishes.
      </Paragraph>
      <Title level={4}>Developed with</Title>
      <Paragraph>
        React 18 + Vite + Ant Design 5 on the frontend, and Node.js + Express +
        MongoDB on the backend.
      </Paragraph>
      <Title level={4}>Contact</Title>
      <Space direction="vertical">
        <span><MailOutlined /> support@foodeazy.com</span>
        <span><GithubOutlined /> github.com/rick-peng-li/FoodEazy-web</span>
      </Space>
    </Card>
  );
};

export default Contact;
