
import { PropsWithChildren } from "react";
import { NavBar } from "./nav-bar";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
import React from 'react';
import { useAuth } from "../hooks/use-auth";
import { Link } from 'wouter';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logoutMutation } = useAuth();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-background border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex gap-4 items-center">
            <Link href="/">
              <a className="font-bold">艺术博物馆</a>
            </Link>
            {user && (
              <>
                <Link href="/add">
                  <a>添加艺术品</a>
                </Link>
                <Link href="/city">
                  <a>城市</a>
                </Link>
              </>
            )}
          </div>
          <div>
            {user ? (
              <div className="flex items-center gap-4">
                <span>你好，{user.username}</span>
                <button 
                  className="px-3 py-1 border rounded hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  退出登录
                </button>
              </div>
            ) : (
              <Link href="/auth">
                <a>登录/注册</a>
              </Link>
            )}
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
