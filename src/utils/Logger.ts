export class Logger {
  service: string;

  constructor(service: string) {
    this.service = service;
  }

  private format(type: string, message: string): string {
    const time = new Date().toISOString();
    return `${time} [${this.service}] ${type}: ${message}`;
  }

  info(message: string, ...args: unknown[]): void {
    console.log(this.format("INFO", message), ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(this.format("WARN", message), ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(this.format("ERROR", message), ...args);
  }
}
