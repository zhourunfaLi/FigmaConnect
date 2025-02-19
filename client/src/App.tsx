import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ArtworkPage from "@/pages/artwork-page";
import AddArtworkPage from "@/pages/add-artwork-page";
import WorkDetails from "@/pages/WorkDetails";
import NotFound from "@/pages/not-found";
import UserPage from "@/pages/user-page";

function Router() {
  return (
    <Switch>
      <Route path="/home">{HomePage}</Route>
      <Route path="/auth">{AuthPage}</Route>
      <Route path="/artwork/:id">{ArtworkPage}</Route>
      <Route path="/add-artwork">{AddArtworkPage}</Route>
      <Route path="/">{ProtectedRoute(UserPage)}</Route>
      <Route path="/work/:id">{WorkDetails}</Route>
      <Route>{NotFound}</Route>
    </Switch>
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