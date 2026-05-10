import * as yup from "yup";
import { EditorView } from "@codemirror/view";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { linter, lintGutter, type Diagnostic } from "@codemirror/lint";
import { MacroUtils } from "@/utils/MacroUtils";

export interface ErrorItem {
  path?: string;
  message: string;
}

type PosMap = Map<string, { from: number; to: number }>;

class JsonEditorUtils {
  static buildPositionMap(src: string): PosMap {
    const map: PosMap = new Map();
    let i = 0;

    const skip = () => {
      while (
        i < src.length &&
        (src[i] === " " ||
          src[i] === "\t" ||
          src[i] === "\n" ||
          src[i] === "\r")
      )
        i++;
    };

    const readStr = (): string => {
      const start = i++;
      while (i < src.length) {
        if (src[i] === "\\") {
          i += 2;
          continue;
        }
        if (src[i] === '"') {
          i++;
          break;
        }
        i++;
      }
      return JSON.parse(src.slice(start, i)) as string;
    };

    const readVal = (path: string): void => {
      skip();
      const from = i;

      if (src[i] === '"') {
        i++;
        while (i < src.length) {
          if (src[i] === "\\") {
            i += 2;
            continue;
          }
          if (src[i] === '"') {
            i++;
            break;
          }
          i++;
        }
      } else if (src[i] === "{") {
        i++;
        skip();
        while (i < src.length && src[i] !== "}") {
          skip();
          const key = readStr();
          skip();
          i++; // ':'
          readVal(path ? `${path}.${key}` : key);
          skip();
          if (src[i] === ",") i++;
        }
        if (src[i] === "}") i++;
      } else if (src[i] === "[") {
        i++;
        skip();
        let idx = 0;
        while (i < src.length && src[i] !== "]") {
          readVal(`${path}[${idx++}]`);
          skip();
          if (src[i] === ",") i++;
          else break;
        }
        if (src[i] === "]") i++;
      } else {
        while (
          i < src.length &&
          src[i] !== "," &&
          src[i] !== "}" &&
          src[i] !== "]" &&
          src[i] !== " " &&
          src[i] !== "\t" &&
          src[i] !== "\n" &&
          src[i] !== "\r"
        )
          i++;
      }

      map.set(path, { from, to: i });
    };

    try {
      skip();
      readVal("");
    } catch {
      /* partial map is fine */
    }

    return map;
  }

  static toErrorItems(err: unknown): ErrorItem[] {
    if (err instanceof SyntaxError) return [{ message: err.message }];
    if (err instanceof yup.ValidationError) {
      const inner = err.inner;
      if (inner.length > 0) {
        return inner.map((e) => ({
          path: e.path ?? undefined,
          message: e.message,
        }));
      }
      return [{ path: err.path ?? undefined, message: err.message }];
    }
    return [];
  }

  static async lintSource(
    this: void,
    view: EditorView
  ): Promise<readonly Diagnostic[]> {
    const content = view.state.doc.toString();
    try {
      const parsed = JSON.parse(content) as unknown;
      await MacroUtils.stepsSchema.validate(parsed, { abortEarly: false });
      return [];
    } catch (err) {
      if (err instanceof SyntaxError) return [];
      if (err instanceof yup.ValidationError) {
        const positions = JsonEditorUtils.buildPositionMap(content);
        const inner = err.inner.length > 0 ? err.inner : [err];
        return inner.map((e): Diagnostic => {
          const pos = e.path ? positions.get(e.path) : undefined;
          return {
            from: pos?.from ?? 0,
            to: pos?.to ?? content.length,
            message: e.path ? `[${e.path}] ${e.message}` : e.message,
            severity: "error",
          };
        });
      }
      return [];
    }
  }

  static readonly extensions = [
    json(),
    linter(jsonParseLinter()),
    linter(JsonEditorUtils.lintSource, { delay: 400 }),
    lintGutter(),
    EditorView.lineWrapping,
    EditorView.theme({
      "&": { fontSize: "12px" },
      ".cm-scroller": {
        fontFamily: "ui-monospace, 'Cascadia Code', Consolas, monospace",
      },
    }),
  ];
}

export { JsonEditorUtils };
