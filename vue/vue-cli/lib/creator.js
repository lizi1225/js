const { fetchRepoList, fetchTagList } = require("./request")
const Inquirer = require('inquirer')
const { wrapLoading } = require("./utils")
const downloadGitRepo = require('download-git-repo')
const util = require('util')
const path = require('path')

class Creator {
    constructor(projectName, targetDir) {
        this.name = projectName
        this.targetDir = targetDir

        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }
    async create() {
        // 1.先去拉取当前组织下的模板
        const repo = await this.fetchRepo()
        // 2.通过模板找到版本号
        const tag = await this.fetchTag(repo)
        // 3.下载
        // const downloadUrl = await this.download(repo, tag)
        await this.download(repo, tag)
    }
    async fetchRepo() {
        const repos = await wrapLoading(fetchRepoList, 'Waiting fetch template...')
        if (!repos) return
        const repoNames = repos.map((item) => item.name)
        const { repoName } = await Inquirer.prompt({
            name: 'repoName',
            type: 'list',
            choices: repoNames,
            message: 'Please choose a template to create project'
        })
        return repoName
    }
    async fetchTag(repo) {
        const tags = await wrapLoading(fetchTagList, 'Waiting fetch tagList...', repo)
        if (!tags) return
        const tagVersions = tags.map((tag) => tag.name)
        const { tag } = await Inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tagVersions,
            message: 'Please choose a tag to create project'
        })
        return tag
    }
    async download(repo, tag) {
        // 1.拼接下载路径
        const requestUrl = `zhu-cli/${repo}${tag ? ('#' + tag) : ''}`
        // 2.把资源下载到某个路径上（后续可以增加缓存功能，应该下载到系统目录中，然后可以使用
        // ejs handlerbar去渲染模板 最后生成结果 再写入）
        // 先放到系统文件中 -> 文件和用户选择生成结果后 -> 放到当前目录下
        await wrapLoading(this.downloadGitRepo, 'Waiting downloading template...', requestUrl, path.resolve(process.cwd(), `${repo}@${tag}`))
        return this.targetDir
    }
}

module.exports = Creator