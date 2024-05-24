/* eslint @typescript-eslint/naming-convention: off */
import path from 'path';
import fs from 'fs/promises';
import { ErrorObject } from 'ajv';
import { File, FileType, parseFilePath } from './figma-rest-client.js';
import librarySchema from './library-schema.js';
import { ISchemaValidator, SchemaValidator } from './schema-validator.js';

/**
 * This needs to stay aligned to {@link ./library-schema.json}
 */
interface LibrarySchema {
  /**
   * URL to the Figma Library file
   */
  libraryFile: string;

  /**
   * The directory to emit assets
   */
  outDir: string;
}

export interface ILibraryConfig {
  readonly file: File;
  readonly valid: boolean;
  readonly errorMessages: Array<string>;
  readonly outDir: string;
}

class ErrorLibraryConfig implements ILibraryConfig {
  constructor(public readonly errorMessages: Array<string>) {
  }
  public readonly file: File = { url: '', file_key: '', file_name: '', file_type: FileType.file };
  public readonly valid = false;
  public readonly outDir: string = '';
}

export class LibraryConfig implements ILibraryConfig {
  private static validator: ISchemaValidator | null = null;
  private constructor(args: LibrarySchema, configDir: string) {
    this.file = parseFilePath(args.libraryFile);
    this.outDir = path.resolve(configDir, args.outDir);
  }

  public readonly valid: boolean = true;
  public readonly errorMessages: Array<string> = [];
  public readonly file: File;
  public readonly outDir: string;

  public static async create(configPath: string): Promise<ILibraryConfig> {
    const configData = (await fs.readFile(configPath)).toString();
    const validator = await LibraryConfig.getOrCreateValidator();
    const result = await validator.validate(configData);

    if (result === true) {
      return new LibraryConfig(JSON.parse(configData), path.dirname(configPath));
    } else {
      const messages = (result as ErrorObject[]).map(error => `${error.instancePath}: ${error.message}`);
      return new ErrorLibraryConfig(messages);
    }
  }

  private static async getOrCreateValidator(): Promise<ISchemaValidator> {
    if (LibraryConfig.validator === null) {
      const schema = JSON.stringify(librarySchema);
      LibraryConfig.validator = SchemaValidator.create(schema);
    }

    return LibraryConfig.validator;
  }
}
