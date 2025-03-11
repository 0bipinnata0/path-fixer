import cac from 'cac';
import fs from 'fs-extra';
import path from 'path';
import { replaceAbsolutePaths } from './replacer';
import { Logger } from './logger';

const cli = cac('path-fixer');
import pkg from '../package.json';

cli.version(pkg.version);
cli.help();

cli
  .command('fix <docArchivePath>', '修复 DocC 文档中的绝对路径问题')
  .option('--base-url <baseUrl>', '设置基础 URL 前缀', { default: '' })
  .option('--verbose', '显示详细日志信息', { default: false })
  .action(async (docArchivePath: string, options: { baseUrl: string, verbose: boolean }) => {
    try {
      const { baseUrl, verbose } = options;
      const logger = new Logger(verbose);
      const archivePath = path.resolve(docArchivePath);
      
      if (!fs.existsSync(archivePath)) {
        logger.error(`错误: 路径 "${archivePath}" 不存在`);
        process.exit(1);
      }
      
      if (!fs.statSync(archivePath).isDirectory()) {
        logger.error(`错误: "${archivePath}" 不是一个目录`);
        process.exit(1);
      }
      
      logger.log(`开始处理文档: ${archivePath}`);
      logger.log(`使用基础 URL: ${baseUrl || '(无)'}`);
      logger.debug(`Verbose 模式已启用`);
      
      // 处理 HTML 文件
      const htmlFiles = await findFiles(archivePath, '.html');
      logger.log(`找到 ${htmlFiles.length} 个 HTML 文件`);
      
      let fixedCount = 0;
      for (const file of htmlFiles) {
        logger.debug(`正在处理文件: ${file}`);
        const modifiedContent = replaceAbsolutePaths(file, baseUrl, logger);
        
        if (modifiedContent !== null) {
          // 直接覆盖原文件
          fs.writeFileSync(file, modifiedContent, 'utf8');
          logger.debug(`已修复: ${file}`);
          fixedCount++;
        } else {
          logger.debug(`无需修复: ${file}`);
        }
      }
      
      logger.log(`成功修复 ${fixedCount} 个文件`);
      logger.log('完成!');
    } catch (error) {
      const logger = new Logger(options.verbose);
      logger.error('处理过程中发生错误:', error);
      process.exit(1);
    }
  });

// 查找指定扩展名的文件
async function findFiles(dir: string, extension: string): Promise<string[]> {
  const files: string[] = [];
  
  async function scan(directory: string) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    await Promise.all(entries.map(async (entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }));
  }
  
  await scan(dir);
  return files;
}

cli.parse(); 