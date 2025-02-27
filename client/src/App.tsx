import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route, Router } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ArtworkPage from "@/pages/artwork-page";
import AddArtworkPage from "@/pages/add-artwork-page";
import NotFound from "@/pages/not-found";
import { CityPage } from "@/components/city-page";
import { useAuth } from "@/hooks/use-auth"; // Added import for useAuth


// Added AppLayout component
const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  return (
    <>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          {user && <li><a href="/add">Add Artwork</a></li>}
          {user && <li><a href="/city">City</a></li>}
          {user && <li><button onClick={logout}>Logout</button></li>}
          {!user && <li><a href="/auth">Login/Register</a></li>}
        </ul>
      </nav>
      <main>{children}</main>
    </>
  );
};


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

function App() {
  const { user } = useAuth(); // Added to access user authentication status

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppLayout> {/* Wrapped RouterComponent with AppLayout */}
            <RouterComponent />
          </AppLayout>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;