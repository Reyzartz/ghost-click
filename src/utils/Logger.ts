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
    this.log("INFO", message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log("WARN", message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log("ERROR", message, ...args);
  }

  private log(
    type: "INFO" | "WARN" | "ERROR",
    message: string,
    ...args: unknown[]
  ): void {
    if (process.env.NODE_ENV === "production") return;

    const formattedMessage = this.format(type, message);
    switch (type) {
      case "INFO":
        console.log(formattedMessage, ...args);
        break;
      case "WARN":
        console.warn(formattedMessage, ...args);
        break;
      case "ERROR":
        console.error(formattedMessage, ...args);
        break;
    }
  }
}
