import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route, Router } from "wouter";
import { Home } from "./pages/home";
import { AuthPage } from "./pages/auth-page";
import { ArtworkPage } from "./pages/artwork-page";
import { AppLayout } from "./components/app-layout";
import { AuthProvider } from "./hooks/use-auth";
import { Toaster } from "./components/ui/toaster";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppLayout>
            <main>
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/auth" component={AuthPage} />
                <Route path="/artwork/:id" component={ArtworkPage} />
                {/* Added routes to maintain functionality from original code */}
                <Route path="/city" component={() => <div>City Page</div>} /> {/* Placeholder */}
                <Route path="/add" component={() => <div>Add Artwork Page</div>} /> {/* Placeholder */}
                <Route component={() => <div>Not Found</div>} /> {/* Placeholder */}

              </Switch>
            </main>
          </AppLayout>
        </Router>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}