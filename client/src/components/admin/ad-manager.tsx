
import React, { useState } from 'react';
import { useAds } from '@/contexts/ad-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AdManager() {
  const { adConfigs, updateAdConfig, isAdminMode } = useAds();
  const [open, setOpen] = useState<Record<string, boolean>>({});

  if (!isAdminMode) return null;

  const toggleOpen = (id: number) => {
    setOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleEnabled = (id: number, isEnabled: boolean) => {
    updateAdConfig({ id, isEnabled });
  };

  const handleUpdateInterval = (id: number, adInterval: string) => {
    updateAdConfig({ id, adInterval: parseInt(adInterval) || 0 });
  };

  const handleAddPosition = (id: number, positions: number[]) => {
    const newPositions = [...positions, positions.length > 0 ? Math.max(...positions) + 1 : 0];
    updateAdConfig({ id, adPositions: newPositions });
  };

  const handleRemovePosition = (id: number, positions: number[], indexToRemove: number) => {
    const newPositions = positions.filter((_, i) => i !== indexToRemove);
    updateAdConfig({ id, adPositions: newPositions });
  };

  const handleUpdatePosition = (id: number, positions: number[], index: number, newValue: string) => {
    const newPositions = [...positions];
    newPositions[index] = parseInt(newValue) || 0;
    updateAdConfig({ id, adPositions: newPositions });
  };

  return (
    <div className="fixed right-4 top-16 z-50 w-80 bg-white p-4 rounded-md shadow-lg border border-gray-200 overflow-auto max-h-[80vh]">
      <h2 className="text-lg font-bold mb-4">广告管理面板</h2>
      
      {adConfigs.map(config => (
        <Collapsible 
          key={config.id} 
          open={open[config.id]} 
          onOpenChange={() => toggleOpen(config.id)}
          className="mb-4 border rounded-md p-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={config.isEnabled} 
                onCheckedChange={(checked) => handleToggleEnabled(config.id, checked)} 
              />
              <Label htmlFor={`${config.id}-enabled`}>{config.pageName} 页面</Label>
            </div>
            
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="p-0 h-8 w-8">
                {open[config.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>
            </CollapsibleTrigger>
          </div>
          
          <CollapsibleContent className="pt-2">
            {config.adInterval !== undefined && (
              <div className="mb-2">
                <Label htmlFor={`${config.id}-interval`}>广告间隔</Label>
                <Input 
                  id={`${config.id}-interval`}
                  value={config.adInterval} 
                  onChange={e => handleUpdateInterval(config.id, e.target.value)}
                  type="number"
                  min="1"
                  className="mt-1"
                />
              </div>
            )}
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>广告位置</Label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleAddPosition(config.id, config.adPositions)}
                  className="h-7 px-2"
                >
                  <Plus size={14} />
                </Button>
              </div>
              
              {config.adPositions.length > 0 ? (
                <div className="space-y-2">
                  {config.adPositions.map((pos, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Input 
                        value={pos} 
                        onChange={e => handleUpdatePosition(config.id, config.adPositions, idx, e.target.value)}
                        type="number"
                        min="0"
                        className="h-8"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemovePosition(config.id, config.adPositions, idx)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">没有设置广告位置</p>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}
