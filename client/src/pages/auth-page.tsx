
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import React from 'react';

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const [, setLocation] = useLocation();

  React.useEffect(() => {
    if (user) {
      setLocation("/user");
    }
  }, [user, setLocation]);

  const handleWechatLogin = () => {
    loginMutation.mutate({ 
      username: "test", 
      password: "test123" 
    });
  };

  return (
    <div className="min-h-screen bg-[#EEEAE2] relative">
      <img 
        src="/src/assets/design/works-01.png" 
        alt="background" 
        className="w-full h-screen object-cover absolute inset-0"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/50 to-black/17" />

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h2 className="text-white text-lg tracking-[3px] mb-16">
          请微信登录后查看
        </h2>

        <Button 
          onClick={handleWechatLogin}
          disabled={loginMutation.isPending}
          className="w-[234px] h-[42px] bg-[#007AFF] rounded-[20px] text-[#FCF7F1] text-base font-normal disabled:opacity-50"
        >
          {loginMutation.isPending ? "登录中..." : "同意并继续"}
        </Button>

        <div className="mt-14 text-center relative">
          <span className="text-white text-sm">我已阅读并同意</span>
          <div className="w-[11px] h-[11px] border border-white rounded-full absolute left-[66px] top-[5px]">
            <div className="w-[5px] h-[5px] bg-white rounded-full absolute left-[2px] top-[2px]" />
          </div>
          <div className="mt-1">
            <a href="#" className="text-[#4FA8EC] text-sm">《用户协议》</a>
            <a href="#" className="text-[#4FA8EC] text-sm">《隐私协议》</a>
            <a href="#" className="text-[#4FA8EC] text-sm">《支付协议》</a>
          </div>
        </div>
      </div>
    </div>
  );
}
