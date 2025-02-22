import { readdir } from "fs/promises";
import { join } from "path";

import { BeccaLyria } from "../interfaces/BeccaLyria";
import { Context } from "../interfaces/contexts/Context";

import { beccaErrorHandler } from "./beccaErrorHandler";

/**
 * Reads the `/contexts` directory and dynamically imports the files,
 * then pushes the imported data to an array.
 *
 * @param {BeccaLyria} Becca Becca's Discord instance.
 * @returns {Context[]} Array of Context objects representing the imported commands.
 */
export const loadContexts = async (Becca: BeccaLyria): Promise<Context[]> => {
  try {
    const result: Context[] = [];
    const files = await readdir(
      join(process.cwd(), "prod", "contexts"),
      "utf-8"
    );
    for (const file of files) {
      const name = file.split(".")[0];
      const mod = await import(join(process.cwd(), "prod", "contexts", file));
      result.push(mod[name] as Context);
    }
    return result;
  } catch (err) {
    await beccaErrorHandler(Becca, "slash command loader", err);
    return [];
  }
};
