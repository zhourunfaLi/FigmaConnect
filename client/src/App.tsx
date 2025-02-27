import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route, Router } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ArtworkPage from "@/pages/artwork-page";
import AddArtworkPage from "@/pages/add-artwork-page";
import NotFound from "@/pages/not-found";
import { CityPage } from "@/components/city-page";

// 移动到内部组件，确保在AuthProvider内部使用
function RouterComponent() { 
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/city" component={CityPage} />
      <ProtectedRoute path="/artwork/:id" component={ArtworkPage} />
      <ProtectedRoute path="/add" component={AddArtworkPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// 移动到内部组件，确保在AuthProvider内部使用
const AppLayout = ({ children }) => {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <>
      <nav className="bg-background border-b border-border p-4">
        <ul className="flex gap-4 max-w-6xl mx-auto">
          <li><a href="/" className="font-bold">艺术博物馆</a></li>
          {user && <li><a href="/add">添加艺术品</a></li>}
          {user && <li><a href="/city">城市</a></li>}
          {user && (
            <li className="ml-auto">
              <span className="mr-2">你好，{user.username}</span>
              <button 
                className="px-3 py-1 border rounded hover:bg-gray-100"
                onClick={handleLogout}
              >
                退出登录
              </button>
            </li>
          )}
          {!user && <li className="ml-auto"><a href="/auth">登录/注册</a></li>}
        </ul>
      </nav>
      <main>{children}</main>
    </>
  );
};

// 主程序组件
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          {/* 现在这些组件都在AuthProvider内部使用 */}
          <AppLayout>
            <RouterComponent />
          </AppLayout>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;