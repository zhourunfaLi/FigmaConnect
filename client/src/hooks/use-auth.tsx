import React, { createContext, useState, useContext, useEffect } from 'react';
import { insertUserSchema, User as SelectUser, InsertUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: SelectUser | null;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  register: (userData: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SelectUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await apiRequest("/api/user", "GET");
        setUser(userData);
      } catch (error) {
        // 用户未登录，这是正常情况
        console.log("用户未登录", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const userData = await apiRequest<SelectUser>("/api/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      setUser(userData);
      toast({
        title: "登录成功",
        description: `欢迎回来，${userData.username}！`,
      });
    } catch (error) {
      console.error("登录失败", error);
      toast({
        title: "登录失败",
        description: error instanceof Error ? error.message : "请检查用户名和密码",
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData: { username: string; password: string }) => {
    try {
      const validatedData = insertUserSchema.parse(userData);
      const newUser = await apiRequest<SelectUser>("/api/register", {
        method: "POST",
        body: JSON.stringify(validatedData),
      });
      setUser(newUser);
      toast({
        title: "注册成功",
        description: `欢迎，${newUser.username}！`,
      });
    } catch (error) {
      console.error("注册失败", error);
      toast({
        title: "注册失败",
        description: error instanceof Error ? error.message : "请尝试其他用户名",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiRequest("/api/logout", { method: "POST" });
      setUser(null);
      queryClient.clear();
      toast({
        title: "已登出",
        description: "您已成功登出系统",
      });
    } catch (error) {
      console.error("登出失败", error);
      toast({
        title: "登出失败",
        description: "登出时出现问题",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};