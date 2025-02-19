
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";

export function ProtectedRoute(Component: React.ComponentType) {
  return function WrappedComponent() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      );
    }

    if (!user) {
      return <Redirect to="/auth" />;
    }

    return <Component />;
  };
}
