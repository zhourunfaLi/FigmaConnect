
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并Tailwind CSS类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 从作品ID中提取有效的数字ID
 * 支持多种ID格式:
 * - 纯数字: "123"
 * - 带前缀: "artwork-123", "art-123-456"
 * @param id 作品ID字符串
 * @returns 提取的数字ID或null
 */
export function extractArtworkId(id: string | undefined | null): number | null {
  if (!id) {
    console.error("未提供作品ID");
    return null;
  }

  // 尝试直接将ID转换为数字
  const directNumber = Number(id);
  if (!isNaN(directNumber) && directNumber > 0) {
    return directNumber;
  }

  // 尝试从带前缀的ID中提取数字
  // 例如: "artwork-123", "art-123-456"
  const matches = id.match(/[a-zA-Z]+-(\d+)(?:-\d+)?/);
  if (matches && matches[1]) {
    const extractedId = Number(matches[1]);
    if (!isNaN(extractedId) && extractedId > 0) {
      return extractedId;
    }
  }
  
  // 无法提取到有效ID
  console.error(`无法从${id}提取有效的作品ID`);
  return null;
}
