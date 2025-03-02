
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/**
 * 提取作品ID函数 - 从各种可能的ID格式中提取有效的数字ID
 */
export function extractArtworkId(id: string | number): number | null {
  // 如果是数字，直接返回
  if (typeof id === 'number' && !isNaN(id)) {
    return id;
  }
  
  // 如果是字符串，尝试不同的提取方法
  if (typeof id === 'string') {
    // 尝试直接解析为数字
    const directParse = parseInt(id);
    if (!isNaN(directParse)) {
      return directParse;
    }
    
    // 尝试从格式如 "art-123-456" 中提取
    if (id.includes('-')) {
      const parts = id.split('-');
      if (parts.length >= 2) {
        const extractedId = parseInt(parts[1]);
        if (!isNaN(extractedId)) {
          return extractedId;
        }
      }
    }
  }
  
  // 无法提取到有效ID，返回null
  return null;
}
