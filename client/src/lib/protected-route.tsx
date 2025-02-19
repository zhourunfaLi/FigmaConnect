import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";

export const ProtectedRoute = (Component: React.ComponentType) => {
  const ProtectedComponent = (props: any) => {
    const { user } = useAuth();
    const [, setLocation] = useLocation();

    useEffect(() => {
      if (!user) {
        setLocation("/auth");
      }
    }, [user, setLocation]);

    if (!user) {
      return null;
    }

    return <Component {...props} />;
  };

  return ProtectedComponent;
};