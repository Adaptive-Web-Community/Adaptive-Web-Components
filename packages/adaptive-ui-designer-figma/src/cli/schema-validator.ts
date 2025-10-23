/* eslint @typescript-eslint/naming-convention: off */
import { Ajv, type ErrorObject, ValidateFunction } from 'ajv';

const ajv = new Ajv();

export interface ISchemaValidator {
  /**
   * Validates a JSON schema against the validator
   * @param json - The JSON string to validate, or a JavaScript object
   */
  validate(json: string | object): Promise<boolean | ErrorObject[]>;
}

function* IdGenerator(): Generator<string, string, string> {
  let i = 0;

  do {
    yield i.toString();
    i++;
  } while (true);
}

export class SchemaValidator implements ISchemaValidator {
  private static nextId = IdGenerator();
  #schema: object;
  #id: string;
  protected constructor(schema: string | object) {
    if (typeof schema === 'string') {
      this.#schema = JSON.parse(schema);
    } else {
      this.#schema = schema;
    }
    this.#id = SchemaValidator.nextId.next().value;
    this.#schema = this.normalize(schema);
  }

  /**
   * Normalizes JSON input
   */
  private normalize(value: string | object): object {
    if (typeof value === 'string') {
      return JSON.parse(value);
    } else {
      return value;
    }
  }

  public static create(schema: string): ISchemaValidator {
    return new SchemaValidator(schema);
  }

  public async validate(json: string | object): Promise<boolean | ErrorObject[]> {
    const validator = this.getValidator();
    const data = this.normalize(json);
    const valid = validator(this.normalize(data));
    return valid || validator.errors || false;
  }

  private getValidator(): ValidateFunction {
    const validator = ajv.getSchema(this.#id);

    if (validator) {
      return validator;
    } else {
      ajv.addSchema(this.#schema, this.#id);
      return this.getValidator();
    }
  }
}
