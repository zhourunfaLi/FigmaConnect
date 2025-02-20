
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Switch, Route, Link } from "wouter";
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
import PricePage from './pages/price-page';

function Router() {
  return (
    <div className="pb-16">
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/artwork/:id" component={ArtworkPage} />
        <Route path="/add-artwork" component={AddArtworkPage} />
        <Route path="/user" component={ProtectedRoute(UserPage)} />
        <Route path="/work/:id" component={WorkDetails} />
        <Route path="/price" component={PricePage} />
        <Route path="/" component={HomePage} />
        <Route component={NotFound} />
      </Switch>
    </div>
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


      </Switch>
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-3 z-50">
        <div className="flex justify-around items-center">
          <Link href="/">首页</Link>
          <Link href="/user">用户</Link>
          <Link href="/price">价格</Link>
        </div>
      </nav>
    </div>
  );
}
