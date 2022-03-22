const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const { sleep } = require('./utils')
class Skeleton {
    constructor(options) {
        this.options = options
    }
    async initialize() {
        this.browser = await puppeteer.launch({ headless: false })
    }
    async newPage() {
        const { device } = this.options
        const page = await this.browser.newPage()
        await page.emulate(puppeteer.devices[device])
        return page
    }
    async makeSkeleton(page) {
        const { defer = 5000 } = this.options
        const scriptContent = await fs.readFileSync(path.resolve(__dirname, 'skeletonScript.js'), 'utf-8')
        // 向页面中注入脚本
        await page.addScriptTag({ content: scriptContent })
        // 等脚本执行完
        await sleep(defer)
        // 创建骨架屏的DOM结构
        await page.evaluate((options) => {
            Skeleton.genSkeleton(options)
        }, this.options)
    }
    async genHTML(url) {
        const page = await this.newPage()
        // networkidle2网络空闲时结束
        const response = await page.goto(url, { waitUntil: 'networkidle2' })
        // 如果访问不成功
        if (response && !response.ok()) {
            throw new Error(`${response.status} on ${url}`)
        }
        // 创建骨架屏
        await this.makeSkeleton(page)
        const { html, styles } = await page.evaluate(() => Skeleton.getHtmlAndStyle())
        const result = `
            <style>${styles.join('\n')}</style>
            ${html}
        `
        return result
    }
    async destroy() {
        if (this.browser) {
            await this.browser.close()
            this.browser = null
        }
    }
}

module.exports = Skeleton