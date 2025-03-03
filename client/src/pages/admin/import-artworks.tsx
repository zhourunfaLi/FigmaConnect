
import { useState } from 'react';
import { importFrontendArtworks } from '../../api/artwork-api';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';
import { mockArtworksData } from '../../data/mock-artworks';

export default function ImportArtworksPage() {
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success?: boolean;
    message?: string;
    count?: number;
  }>({});

  const handleImport = async () => {
    setIsImporting(true);
    try {
      // 这里使用前端的模拟数据
      const result = await importFrontendArtworks(mockArtworksData);
      setImportResult(result);
      toast({
        title: '导入成功',
        description: result.message,
      });
    } catch (error) {
      console.error('导入失败', error);
      toast({
        title: '导入失败',
        description: error instanceof Error ? error.message : '未知错误',
        variant: 'destructive',
      });
      setImportResult({ success: false, message: '导入失败' });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle>导入前端作品数据到数据库</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            此操作将把前端模拟的作品数据导入到数据库中，方便观察和调试。
            将导入 {mockArtworksData.length} 条记录。
          </p>

          <Button 
            onClick={handleImport} 
            disabled={isImporting}
            className="mr-4"
          >
            {isImporting ? '导入中...' : '开始导入'}
          </Button>

          {importResult.success !== undefined && (
            <div className={`mt-4 p-4 rounded-md ${importResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
              <h3 className="font-bold">
                {importResult.success ? '导入成功' : '导入失败'}
              </h3>
              <p>{importResult.message}</p>
              {importResult.count && (
                <p>当前数据库中共有 {importResult.count} 个作品。</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

