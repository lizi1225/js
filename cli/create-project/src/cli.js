import { parseArgs, handleOptions } from './main';
import { createProject } from './file.js';

export async function cli(args) {
    let options = parseArgs(args);
    options = await handleOptions(options);
    console.log('options', options);
    await createProject(options);
}