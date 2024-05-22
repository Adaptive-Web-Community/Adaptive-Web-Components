import "./dom-shim.js";
import path from 'path';
import { Command } from 'commander';
import inquirer from 'inquirer';
import { Client  } from './figma-rest-client.js';
import { LibraryConfig } from './library-config.js';
import { Logger } from './logger.js';
import { AnatomyConfiguration } from './anatomy.js';
import { StyleSheet } from './stylesheet.js';
import { alphabetize } from './string-utils.js';

const program = new Command();
const logger = Logger.create();
const programName = 'Highspot Design-to-Code';

program
  .name(programName)
  .description('A CLI tool for generating CSS stylesheets from Figma Library Components')
  .requiredOption('-l, --library <path>', 'Path to the library configuration file.')
  .action(main);

interface ProgramOptions {
  library: string;
}

async function main({ library }: ProgramOptions) {
  logger.neutral('Validating library config file...');
  const configPath = path.resolve(process.cwd(), library);
  const libraryConfig = await LibraryConfig.create(configPath);
  if (libraryConfig.valid !== true) {
    logger.fail('Hmmm... there is something wrong with the config file you provided.');
    process.exit(1);
  }

  logger.success('Library config is valid!');

  const patRequest = {
    type: 'password',
    name: 'pat',
    message: 'Please provide your Figma personal access token',
  };

  const response = await inquirer.prompt([patRequest]);
  console.log(response.pat, response.pat.length)
  const client = Client.create({
    pat: response.pat
  });

  logger.neutral('Requesting Figma Library.');
  const libraryComponentsResponse = await client.getFileComponentSets(libraryConfig.file);

  if (libraryComponentsResponse.error || libraryComponentsResponse.status !== 200) {
    logger.fail(`Accessing Figma library failed with status code ${libraryComponentsResponse.status}`);
    process.exit(1);
  }

  logger.success('Your library was successfully retrieved!');

  const { component_sets } = libraryComponentsResponse.meta;

  // This is an arbitrary filter for Polar components
  // What is a good mechanism to use?
  const allComponents = component_sets.filter((value) => {
    return value.containing_frame?.pageName.startsWith('Core:');
  });

  const componentNames = allComponents.map((value) => value.name).sort(alphabetize);
  const pickComponentsRequest = {
    type: 'list',
    name: 'all',
    message: 'Which component stylesheets would you like to generate?',
    choices: ['All', 'Choose which'],
  };

  const pickComponentsResponse = await inquirer.prompt([pickComponentsRequest]);
  const componentNamesToRender: string[] = [];

  if (pickComponentsResponse.all !== 'All') {
    const chooseComponentsRequest = {
      type: 'checkbox',
      name: 'which',
      message: 'Choose components:',
      choices: componentNames,
    };
    const components = await inquirer.prompt([chooseComponentsRequest]);
    componentNamesToRender.push(...components.which);
  } else {
    componentNamesToRender.push(...componentNames);
  }

  if (componentNamesToRender.length === 0) {
    logger.warn(`No components selected, exiting ${programName}.`);
    process.exit(0);
  }

  logger.warn(
    `Generating stylesheets for ${componentNamesToRender.length} component${
      componentNamesToRender.length === 1 ? '' : 's'
    }\n${componentNamesToRender.join(', ')}`
  );

  const confirm = await inquirer.prompt({ type: 'confirm', message: 'Would you like to continue?', name: 'confirm' });

  if (confirm.confirm) {
    logger.success('Generating component stylesheets. This may take a moment.');

    const nameLookup = new Set(componentNamesToRender);
    const componentsToRender = allComponents.filter((value) => {
      return nameLookup.has(value.name);
    });

    const anatomies = await Promise.allSettled(
      componentsToRender.map(async (value) => {
        const file = await client.getFileNodes(libraryConfig.file, { ids: value.node_id, plugin_data: 'shared' });
        const nodeId = Object.keys(file.nodes)[0];
        const node = file.nodes[nodeId];

        try {
          const anatomy = await AnatomyConfiguration.create(libraryConfig, node.document, logger);
          return anatomy;
                  } catch (e) {
          logger.fail('Something went wrong compiling anatomy');
          logger.fail(e as any);
          return null;
        }
      })
    );

    await Promise.allSettled(
      anatomies.map(async (anatomy) => {
      if (anatomy.status === "fulfilled" && anatomy.value !== null) {
        const stylesheet = StyleSheet.create(anatomy.value, logger);
        await stylesheet.render();
      } 
    })
    );

    // process components
  } else {
    logger.neutral(`Exiting ${programName}`);
  }

  process.exit(0);
}

// Init program
program.parse();
