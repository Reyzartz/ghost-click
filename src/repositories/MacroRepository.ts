import { Macro } from "@/models";
import { Storage } from "@/utils/Storage";
import { Logger } from "@/utils/Logger";
import { Emitter } from "@/utils/Emitter";

const MACROS_STORAGE_KEY = "macros";

export class MacroRepository {
  private readonly logger: Logger;

  constructor(
    private readonly emitter: Emitter,
    private readonly storage: Storage
  ) {
    this.logger = new Logger("MacroRepository");
  }

  async save(macro: Macro): Promise<void> {
    const macros = await this.loadAll();

    const existingIndex = macros.findIndex((m) => m.id === macro.id);

    if (existingIndex !== -1) {
      macros[existingIndex] = macro;
      this.logger.info(`Updated macro: ${macro.id}`);
    } else {
      macros.push(macro);
      this.logger.info(`Saved new macro: ${macro.id}`);
    }

    await this.storage.set(MACROS_STORAGE_KEY, macros);

    this.emitter.emit("SAVED_MACRO", macro);
  }

  async loadAll(): Promise<Macro[]> {
    const macros = await this.storage.get<Macro[]>(MACROS_STORAGE_KEY);
    return macros ?? [];
  }

  async loadByDomain(domain: string): Promise<Macro[]> {
    const macros = await this.loadAll();
    return macros.filter((m) => m.domain === domain);
  }

  async findById(id: string): Promise<Macro | null> {
    const macros = await this.loadAll();
    return macros.find((m) => m.id === id) ?? null;
  }

  async findByName(name: string): Promise<Macro | null> {
    const macros = await this.loadAll();
    return macros.find((m) => m.name === name) ?? null;
  }

  async delete(id: string): Promise<void> {
    const macros = await this.loadAll();
    const filtered = macros.filter((m) => m.id !== id);

    if (filtered.length === macros.length) {
      this.logger.warn(`Macro not found for deletion: ${id}`);
      return;
    }

    await this.storage.set(MACROS_STORAGE_KEY, filtered);
    this.logger.info(`Deleted macro: ${id}`);
  }

  async isIdUnique(id: string): Promise<boolean> {
    const macro = await this.findById(id);
    return macro === null;
  }

  async isNameUnique(name: string): Promise<boolean> {
    const macro = await this.findByName(name);
    return macro === null;
  }

  async clearAll(): Promise<void> {
    await this.storage.set(MACROS_STORAGE_KEY, []);
    this.logger.info("Cleared all macros");
  }
}
