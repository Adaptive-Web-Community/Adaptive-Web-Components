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
const programName = 'Adaptive UI Figma Stylesheet generator';

program
  .name(programName)
  .description('A CLI tool for generating CSS stylesheets from Figma Library Components')
  .requiredOption('-l, --library <path>', 'Path to the library configuration file.')
  .option('-c, --components <names>', 'Comma-delimited list or wildcard pattern of components to generate (e.g., "anchor,button" or "content navigation *")')
  .action(main);

interface ProgramOptions {
  library: string;
  components?: string;
}

/**
 * Matches a component name against a pattern that may include wildcards.
 * @param componentName - The component name to test
 * @param pattern - The pattern to match against (supports * wildcard)
 * @returns true if the component name matches the pattern
 */
function matchesPattern(componentName: string, pattern: string): boolean {
  const normalizedComponent = componentName.toLowerCase().trim();
  const normalizedPattern = pattern.toLowerCase().trim();
  
  // Convert wildcard pattern to regex
  const regexPattern = normalizedPattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&') // Escape special regex chars except *
    .replace(/\*/g, '.*'); // Convert * to .*
  
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(normalizedComponent);
}

/**
 * Filters component names based on comma-delimited patterns or wildcards.
 * @param componentNames - Array of all available component names
 * @param filterString - Comma-delimited patterns (e.g., "button,card" or "content navigation *")
 * @returns Array of matching component names
 */
function filterComponentNames(componentNames: string[], filterString: string): string[] {
  const patterns = filterString.split(',').map(p => p.trim()).filter(p => p.length > 0);
  
  if (patterns.length === 0) {
    return componentNames;
  }
  
  const matchedNames = new Set<string>();
  
  for (const pattern of patterns) {
    for (const componentName of componentNames) {
      if (matchesPattern(componentName, pattern)) {
        matchedNames.add(componentName);
      }
    }
  }
  
  return Array.from(matchedNames).sort(alphabetize);
}

async function main({ library, components }: ProgramOptions) {
  const configPath = path.resolve(process.cwd(), library);
  logger.neutral('Validating library config file: ' + configPath);
  const libraryConfig = await LibraryConfig.create(configPath);
  if (libraryConfig.valid !== true) {
    logger.fail('Hmmm... there is something wrong with the config file you provided.');
    logger.fail(libraryConfig.errorMessages.join("\n"));
    process.exit(1);
  }

  logger.success('Library config is valid!');

  let pat = process.env.FIGMA_ACCESS_TOKEN;

  if (!pat) {
    const patRequest = {
      type: 'password',
      name: 'pat',
      message: 'Please provide your Figma personal access token (or set the FIGMA_ACCESS_TOKEN environment variable)',
    };
    const response = await inquirer.prompt([patRequest]);
    pat = response.pat;
  }

  if (!pat) {
    logger.fail(`No Figma personal access token provided`);
    process.exit(1);
  }

  const client = Client.create({
    pat
  });

  logger.neutral('Requesting Figma Library.');
  const libraryComponentSetsResponse = await client.getFileComponentSets(libraryConfig.file);

  if (libraryComponentSetsResponse.error || libraryComponentSetsResponse.status !== 200) {
    logger.fail(`Accessing Figma library component sets failed with status code ${libraryComponentSetsResponse.status}: ${(libraryComponentSetsResponse as any).err}`);
    process.exit(1);
  }

  const libraryComponentsResponse = await client.getFileComponents(libraryConfig.file);

  if (libraryComponentsResponse.error || libraryComponentsResponse.status !== 200) {
    logger.fail(`Accessing Figma library components failed with status code ${libraryComponentsResponse.status}: ${(libraryComponentsResponse as any).err}`);
    process.exit(1);
  }

  logger.success('Your library was successfully retrieved!');

  const { component_sets: libraryComponentSets } = libraryComponentSetsResponse.meta;
  const { components: libraryComponents } = libraryComponentsResponse.meta;

  // The file components endpoint returns _all_ components including within a set, filter those out.
  const uniqueComponents = libraryComponents.filter(component => {
    // Filter out components which are in a component set
    const hasComponentSet = component.containing_frame?.containingComponentSet !== undefined;

    // Also filter out components which aren't in a container frame (assume they are helper/utility for now)
    const hasContainingFrame = component.containing_frame !== undefined;

    return !hasComponentSet && hasContainingFrame;
  });
  const allComponents = libraryComponentSets.concat(uniqueComponents);

  const componentNames = allComponents.map((value) => value.name).sort(alphabetize);
  let componentNamesToRender: string[] = [];

  // If components filter is provided via CLI, use it directly
  if (components) {
    componentNamesToRender = filterComponentNames(componentNames, components);
    
    if (componentNamesToRender.length === 0) {
      logger.fail(`No components matched the pattern: "${components}"`);
      logger.neutral(`Available components:\n${componentNames.join(', ')}`);
      process.exit(1);
    }
    
    logger.success(`Found ${componentNamesToRender.length} component${componentNamesToRender.length === 1 ? '' : 's'} matching "${components}":`);
    logger.neutral(componentNamesToRender.join(', '));
  } else {
    // Interactive mode when no -c parameter is provided
    const pickComponentsRequest = {
      type: 'list',
      name: 'all',
      message: 'Which component stylesheets would you like to generate?',
      choices: ['All', 'Choose which'],
    };

    const pickComponentsResponse = await inquirer.prompt([pickComponentsRequest]);

    if (pickComponentsResponse.all !== 'All') {
      const chooseComponentsRequest = {
        type: 'checkbox',
        name: 'which',
        message: 'Choose components:',
        choices: componentNames,
      };
      const chosenComponents = await inquirer.prompt([chooseComponentsRequest]);
      componentNamesToRender.push(...chosenComponents.which);
    } else {
      componentNamesToRender.push(...componentNames);
    }
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

  // Only prompt for confirmation in interactive mode
  if (!components) {
    const confirm = await inquirer.prompt({ type: 'confirm', message: 'Would you like to continue?', name: 'confirm' });

    if (!confirm.confirm) {
      logger.neutral(`Exiting ${programName}`);
      process.exit(0);
    }
  }

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

  process.exit(0);
}

// Init program
program.parse();
