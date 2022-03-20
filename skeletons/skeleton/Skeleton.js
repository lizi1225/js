const puppeteer = require('puppeteer')
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
    async genHTML(url) {
        const page = await this.newPage()
        // networkidle2网络空闲时结束
        const response = await page.goto(url, { waitUntil: 'networkidle2' })
        // 如果访问不成功
        if (response && !response.ok()) {
            throw new Error(`${response.status} on ${url}`)
        }
        return 'html'
    }
    async destroy() {
        if (this.browser) {
            await this.browser.close()
            this.browser = null
        }
    }
}

module.exports = Skeleton