import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();

  const handleWechatLogin = () => {
    // 模拟微信登录，使用测试账号
    loginMutation.mutate({ 
      username: "test", 
      password: "test123" 
    });
  };

  // 如果用户已登录，重定向到首页
  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EEEAE2] relative">
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
        <Card className="w-[300px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">登录</CardTitle>
            <CardDescription className="text-center">
              点击下方按钮使用微信登录
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button
              className="w-full bg-[#07C160] hover:bg-[#06B05A]"
              onClick={handleWechatLogin}
            >
              微信一键登录
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}