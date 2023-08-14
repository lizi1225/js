import arg from 'arg';
import inquirer from 'inquirer';

export function parseArgs(rawArgs) {
    const args = arg({
        '--git': Boolean,
        '--yes': Boolean,
        '--install': Boolean,
        // alias
        '-g': '--git',
        '-y': '--yes',
        '-i': '--install',
    }, {
        argv: rawArgs.slice(2),
    });
    return {
        skipPrompts: args['--yes'] || false,
        git: args['--git'] || false,
        template: args._[0],                                    
        runInstall: args['--install'] || false,
    }
}

export async function handleOptions(options) {
    const defaultTemplate = 'JavaScript';
    if (options.skipPrompts) {
        return {
            ...options,
            template: options.template || defaultTemplate,
        }
    }
    // 进入交互逻辑
    const questions = [];
    if (!options.template) {
        questions.push({
            type: 'list',
            name: 'template',
            message: '请选择模板',
            choices: ['JavaScript', 'TypeScript'],
            default: defaultTemplate,
        });
    }
    
    if (!options.git) {
        questions.push({
            type: 'confirm',
            name: 'git',
            message: '是否给项目初始化git仓库？',
            default: false,
        })
    }
    const answers = await inquirer.prompt(questions);
    return {
        ...options,
        template: options.template || answers.template,
        git: options.git || answers.git,
    }
}