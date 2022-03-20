const fs = require('fs-extra')
const path = require('path')
const Inquirer = require('inquirer')
const Creator = require('./creator')

module.exports = async function (projectName, options) {
    const cwd = process.cwd()
    const targetDir = path.join(cwd, projectName)

    if (fs.existsSync(targetDir)) {
        if (options.force) {
            await fs.remove(targetDir)
        } else {
            // 2. 实现命令行交互功能  inquirer
            const { action } = await Inquirer.prompt([
                {
                    name: 'action',
                    type: 'list',
                    message: `Target directory already exists Pick an action`,
                    choices: [
                        { name: 'Overwrite', value: 'overwrite' },
                        { name: 'Cancel', value: false }
                    ]
                }
            ])
            if (!action) {
                return
            }
            if (action === 'overwrite') {
                console.log(`\r\nRemoving....`)
                await fs.remove(targetDir)
            }
        }
    }
    // 创建项目
    const creator = new Creator(projectName, targetDir)
    creator.create()
}