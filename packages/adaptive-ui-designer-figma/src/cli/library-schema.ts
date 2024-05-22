export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://highspot.com/schemas/design-to-code-library.json',
  title: 'Design to Code Library',
  description: 'Describes a valid library file format for generating CSS Stylesheets from a Figma Component Library',
  type: 'object',
  properties: {
    libraryFile: {
      description: 'The URL of the Figma library file',
      type: 'string',
      pattern: '^https://www.figma.com/file/',
    },
    outDir: {
      description: 'Path to directory for created files',
      type: 'string',
    },
  },
  required: ['libraryFile', 'outDir'],
};
