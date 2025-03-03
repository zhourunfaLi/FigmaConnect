import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";

// 认证表单组件
function AuthForm({ mode, onSubmit, isLoading, error }) {
  const defaultValues = { username: '', password: '', email: '', name: '' };
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="输入用户名" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {mode === "register" && (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="输入邮箱" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        {mode === "register" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>姓名</FormLabel>
                <FormControl>
                  <Input placeholder="输入姓名" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input type="password" placeholder="输入密码" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )}
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '处理中...' : mode === 'login' ? '登录' : '注册'}
        </Button>
      </form>
    </Form>
  );
}

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");

  // 处理登录
  const handleLogin = (data) => {
    setLoginError("");
    loginMutation.mutate(data, {
      onError: (error) => {
        console.error("登录失败:", error);
        setLoginError(error.message || "登录失败，请检查用户名和密码");
      }
    });
  };

  // 处理注册
  const handleRegister = (data) => {
    setRegisterError("");
    registerMutation.mutate(data, {
      onError: (error) => {
        console.error("注册失败:", error);
        setRegisterError(error.message || "注册失败，请检查输入信息");
      }
    });
  };

  // 使用useEffect处理重定向，而不是在渲染期间
  useEffect(() => {
    // 如果用户已登录，重定向到首页
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // 如果用户已登录，返回null等待重定向
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader>
            <CardTitle className="text-2xl">欢迎来到艺术博物馆</CardTitle>
            <CardDescription>
              请使用以下测试账号登录或创建新账号：
              <div className="mt-2 p-2 bg-muted rounded-md text-sm">
                <div className="font-medium">测试账号1：</div>
                用户名：<code className="bg-gray-200 px-1 rounded">test</code><br/>
                密码：<code className="bg-gray-200 px-1 rounded">secret42</code>
                <div className="mt-1 font-medium">测试账号2：</div>
                用户名：<code className="bg-gray-200 px-1 rounded">admin</code><br/>
                密码：<code className="bg-gray-200 px-1 rounded">secret42</code>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">登录</TabsTrigger>
                <TabsTrigger value="register">注册</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <AuthForm 
                  mode="login" 
                  onSubmit={handleLogin} 
                  isLoading={loginMutation.isPending}
                  error={loginError}
                />
              </TabsContent>

              <TabsContent value="register">
                <AuthForm 
                  mode="register" 
                  onSubmit={handleRegister}
                  isLoading={registerMutation.isPending}
                  error={registerError}
                />te(data)}
                  isLoading={registerMutation.isPending}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="hidden lg:flex flex-1 bg-muted items-center justify-center p-12">
        <div className="max-w-lg">
          <h2 className="text-3xl font-bold mb-4">探索世界级艺术品</h2>
          <p className="text-lg text-muted-foreground">
            加入我们的社区，探索高清艺术作品，观看独家视频，
            与其他艺术爱好者交流。
          </p>
        </div>
      </div>
    </div>
  );
}

function AuthForm({ 
  mode, 
  onSubmit, 
  isLoading 
}: { 
  mode: "login" | "register";
  onSubmit: (data: InsertUser) => void;
  isLoading: boolean;
}) {
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "加载中..." : mode === "login" ? "登录" : "注册"}
        </Button>
      </form>
    </Form>
  );
}