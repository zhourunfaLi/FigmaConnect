
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const { user, logoutMutation } = useAuth();

  return (
    <nav className="border-b bg-background py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/">
          <span className="font-bold text-lg cursor-pointer">艺术博物馆</span>
        </Link>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                欢迎, {user.username}
              </span>
              {user.isPremium && (
                <span className="px-2 py-0.5 bg-[#EB9800] text-white text-xs font-medium rounded-md">
                  SVIP
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => logoutMutation.mutate()}
              >
                退出登录
              </Button>
            </div>
          ) : (
            <Link href="/auth">
              <Button variant="outline" size="sm">
                登录 / 注册
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
