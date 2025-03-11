/**
 * 日志记录器接口
 */
export interface ILogger {
  log(message: string): void;
  debug(message: string): void;
  error(message: string, error?: any): void;
}

/**
 * 默认日志记录器，用于向后兼容
 */
export const defaultLogger: ILogger = {
  log: console.log,
  debug: () => {}, // 默认不输出调试信息
  error: console.error
};

/**
 * 日志工具封装
 */
export class Logger implements ILogger {
  private verbose: boolean;

  /**
   * 创建一个新的日志记录器
   * @param verbose 是否启用详细日志
   */
  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  /**
   * 记录一般信息，总是显示
   * @param message 日志消息
   */
  log(message: string): void {
    console.log(message);
  }

  /**
   * 记录调试信息，只在 verbose 模式下显示
   * @param message 日志消息
   */
  debug(message: string): void {
    if (this.verbose) {
      console.log(message);
    }
  }

  /**
   * 记录错误信息
   * @param message 错误消息
   * @param error 错误对象（可选）
   */
  error(message: string, error?: any): void {
    console.error(message, error || '');
  }
} 