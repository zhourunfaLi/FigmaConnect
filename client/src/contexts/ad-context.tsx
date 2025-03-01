import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/use-auth';

// 广告配置类型定义
interface AdConfig {
  id: number;
  pageName: string;
  adPositions: number[];
  adInterval?: number;
  isEnabled: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdContextType {
  adConfigs: AdConfig[];
  getAdConfigForPage: (pageName: string) => AdConfig | undefined;
  updateAdConfig: (config: Partial<AdConfig>) => void;
  isAdminMode: boolean;
}

// 创建上下文
const AdContext = createContext<AdContextType | undefined>(undefined);

// 提供者组件
export function AdProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [adConfigs, setAdConfigs] = useState<AdConfig[]>([
    {
      id: 1,
      pageName: 'home',
      adPositions: [2, 5, 8],
      adInterval: 4,
      isEnabled: true
    },
    {
      id: 2,
      pageName: 'works',
      adPositions: [3, 7, 12],
      adInterval: 5,
      isEnabled: true
    },
    {
      id: 3,
      pageName: 'theme',
      adPositions: [2, 6, 10],
      adInterval: 4,
      isEnabled: true
    },
    {
      id: 4,
      pageName: 'artCity',
      adPositions: [2, 5, 8],
      adInterval: 3,
      isEnabled: true
    }
  ]);

  // 管理员模式 - 仅当用户为管理员时才启用
  const isAdminMode = user?.role === 'ADMIN';

  // 根据页面名称获取广告配置
  const getAdConfigForPage = (pageName: string) => {
    return adConfigs.find(config => config.pageName === pageName);
  };

  // 更新广告配置
  const updateAdConfig = (config: Partial<AdConfig>) => {
    setAdConfigs(prev => 
      prev.map(item => 
        item.id === config.id 
          ? { ...item, ...config } 
          : item
      )
    );
  };

  // 提供上下文值
  const value = {
    adConfigs,
    getAdConfigForPage,
    updateAdConfig,
    isAdminMode
  };

  return (
    <AdContext.Provider value={value}>
      {children}
    </AdContext.Provider>
  );
}

// 自定义钩子，用于在组件中使用广告上下文
export function useAds() {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
}