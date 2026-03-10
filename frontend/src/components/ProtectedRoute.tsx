
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  if(isLoading){
    return <div>Loading....</div>
  }
  if (!isAuthenticated) {
    // Show toast alert
    toast({
      variant: "destructive",
      title: "Access denied",
      description: "Please log in to access this content.",
    });
    
    // Redirect to login page, preserving the intended destination
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check for admin access if required
  if (adminOnly && !isAdmin) {
    toast({
      variant: "destructive",
      title: "Admin access required",
      description: "You need administrator permissions to access this page.",
    });
    
    // Redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
