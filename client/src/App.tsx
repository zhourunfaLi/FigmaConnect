
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation } from 'wouter';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { Toaster } from '@/components/ui/toaster';

const queryClient = new QueryClient();

// Example protected route component
const ProtectedRoute = ({ component: Component, ...rest }: { component: React.ComponentType, path: string }) => {
  return <Route {...rest}>
    {(params) => {
      // This will be handled by the ProtectedRoute component in lib/protected-route.tsx
      return <Component {...params} />;
    }}
  </Route>;
};

// Simple route component for unprotected routes
const AppRoute = ({ component: Component, ...rest }: { component: React.ComponentType, path: string }) => {
  return <Route {...rest}>
    {(params) => <Component {...params} />}
  </Route>;
};

// Home page component
const HomePage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>
      <p>This is a simple home page for our application.</p>
    </div>
  );
};

// Auth page component
const AuthPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication</h1>
      <p>Login or register to access the application.</p>
    </div>
  );
};

// Dashboard page component
const DashboardPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.username || 'User'}!</p>
    </div>
  );
};

// Not found page component
const NotFoundPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
    </div>
  );
};

// Router component with all routes
const RouterComponent = () => {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
};

// App layout component
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [, setLocation] = useLocation();
  const { user, logout } = useAuth();
  
  const handleLogout = async () => {
    await logout();
    setLocation('/auth');
  };
  
  return (
    <>
      <nav className="bg-slate-800 text-white p-4">
        <ul className="flex space-x-4">
          <li><a href="/" className="hover:underline">Home</a></li>
          {user ? (
            <>
              <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
              <li><button onClick={handleLogout} className="hover:underline">Logout</button></li>
            </>
          ) : <li><a href="/auth" className="hover:underline">Login/Register</a></li>}
        </ul>
      </nav>
      <main>{children}</main>
    </>
  );
};

// Main App component
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppLayout>
          <RouterComponent />
        </AppLayout>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
