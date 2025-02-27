import React from 'react';
import { Route, useLocation } from 'wouter';
import { useAuth } from '../hooks/use-auth';

interface ProtectedRouteProps {
  component: React.ComponentType;
  path: string;
}

export function ProtectedRoute({ component: Component, path }: ProtectedRouteProps) {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (!user) {
    // 如果用户未登录，重定向到登录页面
    React.useEffect(() => {
      navigate('/auth');
    }, []);
    return null;
  }

  return <Route path={path} component={Component} />;
}