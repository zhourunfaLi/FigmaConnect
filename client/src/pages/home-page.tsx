import { useQuery } from "@tanstack/react-query";
import { type Artwork } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ArtworkGrid from "@/components/artwork-grid";

export default function HomePage() {
  const { data: artworks } = useQuery<Artwork[]>({ 
    queryKey: ["/api/artworks"]
  });
  
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Art Gallery</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.username}
                </span>
                <Button variant="default" asChild>
                  <Link href="/add">Add Artwork</Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => logoutMutation.mutate()}
                  disabled={logoutMutation.isPending}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="default" asChild>
                <Link href="/auth">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Featured Artworks</h2>
          <p className="text-muted-foreground">
            Explore our curated collection of masterpieces
          </p>
        </div>

        {artworks && <ArtworkGrid artworks={artworks} />}
      </main>
    </div>
  );
}
