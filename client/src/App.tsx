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
import PricePage from './pages/price-page'; // Added import for PricePage

function Router() {
  return (
    <Switch>
      <Route path="/home">{HomePage}</Route>
      <Route path="/auth" component={AuthPage} />
      <Route path="/artwork/:id" component={ArtworkPage} />
      <Route path="/add-artwork" component={AddArtworkPage} />
      <Route path="/latest" component={HomePage} />
      <Route path="/user" component={ProtectedRoute(UserPage)} />
      <Route path="/" component={ProtectedRoute(UserPage)} />
      <Route path="/work/:id" component={WorkDetails} />
      <Route path="/price" component={PricePage} />
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