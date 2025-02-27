
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route, Router } from "wouter";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";

import HomePage from "./pages/home-page";
import AuthPage from "./pages/auth-page";
import ArtworkPage from "./pages/artwork-page";
import AddArtworkPage from "./pages/add-artwork-page";
import NotFound from "./pages/not-found";
import { CityPage } from "./components/city-page";
import { AppLayout } from "./components/app-layout";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppLayout>
            <main>
              <Switch>
                <Route path="/" component={HomePage} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/city" component={CityPage} />
                <Route path="/artwork/:id" component={ArtworkPage} />
                <Route path="/add" component={AddArtworkPage} />
                <Route component={NotFound} />
              </Switch>
            </main>
          </AppLayout>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
