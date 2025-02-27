import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import React from 'react';
import { useLocation } from 'wouter';

// Added import for useLocation and React

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Using useEffect to handle navigation, preventing navigation issues during rendering
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-border" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return null; // Waiting for the useEffect above to handle navigation
  }

  return <Component />;
}
import React from 'react';
import { Route, useLocation } from 'wouter';
import { useAuth } from '../hooks/use-auth';

export interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
}

export function ProtectedRoute({ component: Component, path, ...rest }: ProtectedRouteProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  return (
    <Route
      path={path}
      {...rest}
      component={(props: any) => {
        if (!user) {
          // 如果用户未登录，重定向到登录页面
          React.useEffect(() => {
            navigate("/auth");
          }, []);
          return null;
        }
        
        // 如果用户已登录，渲染受保护的组件
        return <Component {...props} />;
      }}
    />
  );
}
