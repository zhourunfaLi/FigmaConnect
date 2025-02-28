import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ArtworkPage from "@/pages/artwork-page";
import AddArtworkPage from "@/pages/add-artwork-page";
import NotFound from "@/pages/not-found";
import { CityPage } from "@/components/city-page";

function UserMenu() {
  const { user, logoutMutation } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="fixed top-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>
            {user.username}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
            <LogOut className="mr-2 h-4 w-4" />
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Router() {
  return (
    <>
      <UserMenu />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/city" component={CityPage} />
        <ProtectedRoute path="/artwork/:id" component={ArtworkPage} />
        <ProtectedRoute path="/add" component={AddArtworkPage} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
