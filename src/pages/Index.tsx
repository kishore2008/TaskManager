
import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to the dashboard instead of root to avoid a loop
  return <Navigate to="/tasks" replace />;
};

export default Index;
