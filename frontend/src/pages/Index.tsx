
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Home immediately
    navigate("/", { replace: true });
  }, [navigate]);

  // This should never render as we redirect immediately
  return null;
};

export default Index;
