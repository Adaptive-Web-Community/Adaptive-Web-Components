/* eslint @typescript-eslint/naming-convention: off */
import fs from 'fs/promises';
import path from 'path';
import type * as FigmaRestAPI from '@figma/rest-api-spec';
import { kebabCase } from 'change-case';
import { parseNode } from '../lib/node-parser.js';
import { Anatomy, type SerializableAnatomy,  } from '../lib/anatomy.js';
import { ILibraryConfig } from './library-config.js';
import { ILogger } from './logger.js';

export interface IAnatomyConfiguration {
  readonly name: string;
  readonly path: string;
}

export class AnatomyConfiguration implements IAnatomyConfiguration {
  public readonly name: string;
  #anatomy: SerializableAnatomy;

  private constructor(anatomy: SerializableAnatomy, public readonly path: string) {
    this.name = anatomy.name;
    this.#anatomy = anatomy;
  }

  public static async create(
    library: ILibraryConfig,
    node: FigmaRestAPI.Node,
    logger: ILogger
  ): Promise<IAnatomyConfiguration> {
    const name = kebabCase(node.name);
    const configurationPath = AnatomyConfiguration.path(library, name);

    let anatomy: SerializableAnatomy;
    try {
      await fs.stat(configurationPath);
      logger.neutral(`Anatomy file for ${name} already exists! Using existing anatomy.`);
      anatomy = JSON.parse((await fs.readFile(configurationPath)).toString()) as unknown as SerializableAnatomy;
    } catch {
      logger.success(`Writing anatomy file for ${name}.`);
      const nodeAnatomy = Anatomy.fromPluginUINodeData(parseNode(node))
      const nodeAnatomyFileData = JSON.stringify(nodeAnatomy, null, 2);
      anatomy = JSON.parse(nodeAnatomyFileData);
      await fs.mkdir(path.parse(configurationPath).dir, { recursive: true }); // ensure dir exists or fs.writeFile will throw
      await fs.writeFile(configurationPath, nodeAnatomyFileData);
    }

    return new AnatomyConfiguration(anatomy, configurationPath);
  }

  public static path(config: ILibraryConfig, name: string): string {
    return path.resolve(process.cwd(), config.outDir, 'anatomies', name + '.json');
  }
}
