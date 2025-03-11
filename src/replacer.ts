import fs from 'fs-extra';
import { ILogger, defaultLogger } from './logger';

/**
 * 确保 URL 前后都有且仅有一个斜杠
 * @param url 需要处理的 URL
 * @returns 处理后的 URL
 */
function normalizeUrl(url: string): string {
  if (!url) return '/';
  
  // 移除开头的所有斜杠
  let normalized = url.replace(/^\/+/, '');
  // 移除结尾的所有斜杠
  normalized = normalized.replace(/\/+$/, '');
  
  // 如果处理后为空，返回单个斜杠
  if (!normalized) return '/';
  
  // 添加开头的斜杠
  return '/' + normalized;
}

/**
 * 替换文件中的绝对路径引用
 * @param filePath 要处理的文件路径
 * @param baseUrl 基础URL前缀
 * @param logger 日志记录器
 * @returns 如果进行了替换，返回修改后的内容；否则返回null
 */
export function replaceAbsolutePaths(filePath: string, baseUrl: string, logger: ILogger = defaultLogger): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 标准化 baseUrl，确保前后都有且仅有一个斜杠
    const normalizedBaseUrl = normalizeUrl(baseUrl);
    logger.debug(`标准化后的 baseUrl: ${normalizedBaseUrl}`);
    
    // 如果 baseUrl 是根路径 "/"，则不需要替换
    if (normalizedBaseUrl === '/') {
      logger.debug(`baseUrl 是根路径，无需替换`);
      return null;
    }
    
    // 创建一个新的内容副本用于修改
    let newContent = content;
    
    // 替换 baseUrl = "/" 为用户指定的 baseUrl
    newContent = newContent.replaceAll(`baseUrl = "/"`, `baseUrl = "${normalizedBaseUrl}/"`);
    
    // 替换 href="/xxx 为 href="/baseUrl/xxx（排除 href="// 的情况）
    newContent = newContent.replaceAll(`href="/css`, `href="${normalizedBaseUrl}/css`);
    
    // 替换 src="/xxx 为 src="/baseUrl/xxx（排除 src="// 的情况）
    newContent = newContent.replaceAll(`src="/js`, `src="${normalizedBaseUrl}/js`);
    
    // 如果内容有变化，返回新内容
    if (content !== newContent) {
      logger.debug(`文件内容已修改`);
      return newContent;
    }
    
    logger.debug(`文件内容无需修改`);
    return null;
  } catch (error) {
    logger.error(`处理文件 ${filePath} 时出错:`, error);
    return null;
  }
} 