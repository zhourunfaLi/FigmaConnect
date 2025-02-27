
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";

export function NavBar() {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) return null;

  return (
    <nav className="bg-background border-b border-border p-4 flex justify-between items-center">
      <div className="font-bold text-xl">艺术博物馆</div>
      <div className="flex items-center gap-4">
        <span>你好，{user.username}</span>
        <Button 
          variant="outline" 
          onClick={handleLogout}
          size="sm"
        >
          退出登录
        </Button>
      </div>
    </nav>
  );
}
