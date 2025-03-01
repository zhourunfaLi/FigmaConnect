
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdConfig } from "@shared/schema";
import { useAuth } from '@/hooks/use-auth';

interface AdContextType {
  adConfigs: AdConfig[];
  isLoading: boolean;
  error: string | null;
  updateAdConfig: (config: Partial<AdConfig>) => Promise<void>;
  getAdConfigForPage: (pageName: string) => AdConfig | undefined;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
}

const AdContext = createContext<AdContextType | undefined>(undefined);

export function AdProvider({ children }: { children: ReactNode }) {
  const [adConfigs, setAdConfigs] = useState<AdConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchAdConfigs = async () => {
      try {
        const response = await fetch('/api/ad-configs');
        if (!response.ok) throw new Error('Failed to fetch ad configs');
        
        const data = await response.json();
        setAdConfigs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // 如果API失败，使用默认配置
        setAdConfigs([
          {
            id: 1,
            pageName: 'home',
            adPositions: [3, 7, 12],
            isEnabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 2,
            pageName: 'artCity',
            adPositions: [2, 5, 8],
            isEnabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: 3,
            pageName: 'theme',
            adInterval: 3,
            adPositions: [],
            isEnabled: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdConfigs();
  }, []);

  const updateAdConfig = async (config: Partial<AdConfig>) => {
    if (!isAdmin) {
      setError('需要管理员权限');
      return;
    }
    
    try {
      const response = await fetch(`/api/ad-configs/${config.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) throw new Error('Failed to update ad config');
      
      const updatedConfig = await response.json();
      setAdConfigs(prev => 
        prev.map(item => item.id === updatedConfig.id ? updatedConfig : item)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  const getAdConfigForPage = (pageName: string) => {
    return adConfigs.find(config => config.pageName === pageName);
  };

  const toggleAdminMode = () => {
    if (isAdmin) {
      setIsAdminMode(!isAdminMode);
    } else {
      setError('需要管理员权限');
    }
  };

  return (
    <AdContext.Provider value={{
      adConfigs,
      isLoading,
      error,
      updateAdConfig,
      getAdConfigForPage,
      isAdminMode,
      toggleAdminMode
    }}>
      {children}
    </AdContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAds must be used within a AdProvider');
  }
  return context;
}
