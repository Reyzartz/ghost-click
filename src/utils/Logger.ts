export class Logger {
  service: string;

  constructor(service: string) {
    this.service = service;
  }

  private format(type: string, message: string): string {
    const time = new Date().toISOString();
    return `${time} [${this.service}] ${type}: ${message}`;
  }

  info(message: string, ...args: any[]): void {
    console.log(this.format("INFO", message), ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(this.format("WARN", message), ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(this.format("ERROR", message), ...args);
  }
}
