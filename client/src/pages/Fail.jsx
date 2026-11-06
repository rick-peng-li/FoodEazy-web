import { Result, Button } from "antd";
import { useNavigate } from "react-router-dom";

const Fail = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="error"
      title="Payment Failed"
      subTitle="Your payment could not be processed. Please try again or choose Cash on Delivery."
      extra={
        <Button type="primary" onClick={() => navigate("/cart")}>
          Back to Cart
        </Button>
      }
    />
  );
};

export default Fail;
