import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
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

// Create a new QueryClient instance
const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/artwork/:id" component={ArtworkPage} />
      <Route path="/add-artwork" component={AddArtworkPage} />
      <Route path="/details/:id" component={WorkDetails} />
      <Route component={NotFound} />
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