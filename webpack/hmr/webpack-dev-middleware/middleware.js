/**
 * 这个express中间件负责提供产出文件的预览
 * 拦截HTTP请求，看请求的文件是不是webpack打包出来的文件
 * 如果是，从硬盘上读出来，返回给客户端
 * @param {*} param0 
 * @returns 
 */
const path = require('path')
const mime = require('mime')
function wrapper({ fs, outputPath }) {
    return (req, res, next) => {
        let url = req.url
        if (url === '/') url = '/index.html'
        const filename = path.join(outputPath, url)
        try {
            const stats = fs.statSync(filename)
            if (stats.isFile()) {
                const content = fs.readFileSync(filename)
                res.setHeader('Content-Type', mime.getType(filename))
                res.send(content)
            } else {
                res.sendStatus(404)
            }
        } catch (error) {
            
        }
    }
}

module.exports = wrapper