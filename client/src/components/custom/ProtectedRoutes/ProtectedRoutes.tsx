import { Navigate } from "react-router-dom";

const ProtectedRoutes = ({ children }: { children: JSX.Element }) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    return <Navigate to={"/login"} replace />;
  }

  return children;
};

export default ProtectedRoutes;
