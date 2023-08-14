import fs from 'fs';
import ncp from 'ncp';
import path from 'path';
import { promisify } from 'util';
import chalk from 'chalk';
import * as execa from 'execa';
import Listr from 'listr';
import { projectInstall } from 'pkg-install';


const access = promisify(fs.access);
const copy = promisify(ncp);

async function copyTemplateFilesDeep(options) {
    console.log('copy', options.templateDirectory, options.targetDirectory);
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });
}

export async function createProject(options) {
    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };
    const templateDirectory = path.resolve(__dirname, '../templates', options.template.toLowerCase());
    options.templateDirectory = templateDirectory;

    try {
        await access(templateDirectory, fs.constants.F_OK);
    } catch(error) {
        console.error('Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    const tasks = new Listr([
        {
            title: '拷贝项目文件',
            task: () => copyTemplateFilesDeep(options),
        },
        {
            title: '初始化git',
            task: () => initGit(options),
            enabled: () => options.git,
        },
        {
            title: '安装项目依赖',
            task: () => projectInstall({
                cwd: options.targetDirectory,
            }),
            skip: () => !options.runInstall ? '跳过安装项目依赖' : undefined,
        }
    ])

    await tasks.run();
    // await copyTemplateFilesDeep(options);
    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}

async function initGit(options) {
    const result = await execa('git', ['init'], {
        cwd: options.targetDirectory,
    })
    if (result.failed) {
        return Promise.reject(new Error('初始化git失败'));
    }
}