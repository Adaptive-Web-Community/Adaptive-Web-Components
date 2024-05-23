/* eslint @typescript-eslint/naming-convention: off */
export interface ILogger {
  /**
   * Logs a message indicating success
   */
  success(message: string): void;
  fail(message: string): void;
  warn(message: string): void;
  neutral(message: string): void;
}
const successColor = '\x1b[32m%s\x1b[0m';
const failColor = '\x1b[31m%s\x1b[0m';
const warnColor = '\x1b[33m%s\x1b[0m';

export class Logger implements ILogger {
  private constructor() { /* privatize constructor */}

  success(message: string): void {
    console.log(successColor, message);
  }
  fail(message: string): void {
    console.error(failColor, message);
  }
  warn(message: string): void {
    console.warn(warnColor, message);
  }
  neutral(message: string): void {
    console.log(message);
  }

  public static create() {
    return new Logger();
  }
}
