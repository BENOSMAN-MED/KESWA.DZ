import { Navigate, useLocation } from "react-router";
import { useApp } from "../context/AppContext";

interface Props {
  children: React.ReactNode;
  roles?: Array<"owner" | "renter" | "admin">;
}

export function ProtectedRoute({ children, roles }: Props) {
  const { isAuthenticated, currentUser } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/connexion" state={{ from: location }} replace />;
  }

  if (roles && currentUser && !roles.includes(currentUser.role as any)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
