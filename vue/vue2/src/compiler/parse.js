const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g


export function parseHTML(html) {

    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            type: 1,
            children: [],
            attrs,
            parent: null
        }
    }
    let root
    let currentParent
    let stack = []
    // 标签是否符合预期 <div><span></span></div> 用栈来检测
    function start(tagName, attrs) {
        let element = createASTElement(tagName, attrs)
        if(!root) {
            root = element
        }
        currentParent = element
        stack.push(element)
    }

    function end(tagName) {
        let element = stack.pop()
        currentParent = stack[stack.length - 1]
        if(currentParent) { // 闭合时可以知道标签父级是谁
            element.parent = currentParent
            currentParent.children.push(element)
        }
    }

    function chars(text) {
        text = text.replace(/\s/g, '')
        if(text) {
            currentParent.children.push({
                type: 3,
                text
            })
        }
    }
    while (html) {
        let textEnd = html.indexOf('<')
        if (textEnd === 0) {
            // 没处理v-bind v-on
            // <!DOCTYPE
            // <!-- -->
            // <br/>自闭合标签
            const startTagMatch = parseStartTag()
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            const endTagMatch = html.match(endTag)
            if (endTagMatch) {
                advance(endTagMatch[0].length)
                end(endTagMatch[1]) // 将结束标签传入
                continue
            }

        }
        let text
        if (textEnd > 0) { //是文本
            text = html.substring(0, textEnd)
        }
        if (text) {
            advance(text.length)
            chars(text)
        }
    }

    function advance(n) {
        html = html.substring(n)
    }

    function parseStartTag() {
        const start = html.match(startTagOpen)
        if (start) {
            const match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            let end
            let attr
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) { // 不是结尾标签 能匹配到属性
                match.attrs.push({
                    name: attr[1],
                    value: attr[3] || attr[4] || attr[5]
                })
                advance(attr[0].length)
            }
            if (end) {
                advance(end[0].length)
                return match
            }
        }
    }
    return root
}
