const MagicString = require('magic-string')
const source = `export var name = "zs"`
const magicString = new MagicString(source)

// 剪出一个子串，前闭后开区间
console.log(magicString.snip(0, 6).toString())
// 删除
console.log(magicString.remove(0, 6).toString())
// 连接多个子串

const bundleString = new MagicString.Bundle()
bundleString.addSource({
    content: 'var a = 1',
    separator: '\n',
})
bundleString.addSource({
    content: 'var b = 2',
    separator: '\n',
})
console.log(bundleString.toString())