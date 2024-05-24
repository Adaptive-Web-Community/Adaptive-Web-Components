/* eslint @typescript-eslint/naming-convention: off */
import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { kebabCase } from 'change-case';
import type { ILogger } from './logger.js';
import type { IAnatomyConfiguration } from './anatomy.js';

export interface IStylesheet {
  render(): Promise<void>;
  readonly path: string;
}

export class StyleSheet implements IStylesheet {
  public readonly path: string;

  private constructor(private anatomy: IAnatomyConfiguration, private logger: ILogger) {
    this.path = path.resolve(path.dirname(anatomy.path), `../stylesheets/${kebabCase(anatomy.name)}.css`);
  }

  public static create(anatomy: IAnatomyConfiguration, logger: ILogger): IStylesheet {
    return new StyleSheet(anatomy, logger);
  }

  public async render(): Promise<void> {
    try {
      const compiler = spawn('npx', ['aui', 'compile-json-anatomy', this.anatomy.path], { shell: true });
      compiler.stderr.on('data', (chunk) => {
        this.logger.fail(chunk);
      });
      await fs.mkdir(path.dirname(this.path), { recursive: true });
      await fs.writeFile(this.path, compiler.stdout);
      this.logger.success(`Writing stylesheet file for ${kebabCase(this.anatomy.name)}.`);
    } catch (e) {
      this.logger.fail('Rendering stylesheet failed.');
      this.logger.fail(e as any);
    }
  }
}