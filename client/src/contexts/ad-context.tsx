
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  isLoading: boolean;
  error: string | null;
  updateAdConfig: (config: Partial<AdConfig>) => Promise<void>;
  getAdConfigForPage: (pageName: string) => AdConfig | undefined;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  shouldShowAdAt: (pageName: string, position: number) => boolean;
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
    async function fetchAdConfigs() {
      try {
        const response = await fetch('/api/ad-configs');
        if (!response.ok) {
          throw new Error('Failed to fetch ad configurations');
        }
        const data = await response.json();
        setAdConfigs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching ad configs:', err);
      } finally {
        setIsLoading(false);
      }
    }

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

  function shouldShowAdAt(pageName: string, position: number): boolean {
    if (isLoading || error) return false;

    const config = adConfigs.find(config => config.pageName === pageName);
    if (!config || !config.isEnabled) return false;

    if (config.adPositions.includes(position)) return true;

    // 对于有间隔的配置
    if (config.adInterval && position % config.adInterval === 0) return true;

    return false;
  }

  return (
    <AdContext.Provider value={{
      adConfigs,
      isLoading,
      error,
      updateAdConfig,
      getAdConfigForPage,
      isAdminMode,
      toggleAdminMode,
      shouldShowAdAt
    }}>
      {children}
    </AdContext.Provider>
  );
}

export function useAds() {
  const context = useContext(AdContext);
  if (context === undefined) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
}
