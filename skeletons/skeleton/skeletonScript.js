window.Skeleton = (function () {
    // 宽1px 高1px的透明gif图
    const SMALLEST_BASE64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
    const CLASS_NAME_PREFIX = 'sk-'
    const $$ = document.querySelectorAll.bind(document)
    const REMOVE_TAGS = ['title', 'meta', 'style', 'script']
    const styleCache = new Map()
    function buttonHandler(element, options = {}) {
        const className = CLASS_NAME_PREFIX + 'button'
        const rule = `{
            color: ${options.color}!important;
            background: ${options.color}!important;
            border: none!important;
            box-shadow: none!important;
        }`
        addStyle(`.${className}`, rule)
        element.classList.add(className)
    }
    function imageHandler(element, options = {}) {
        const { width, height } = element.getBoundingClientRect()
        const attrs = {
            width,
            height,
            src: SMALLEST_BASE64,
        }
        setAttributes(element, attrs)
        const className = CLASS_NAME_PREFIX + 'image'
        const rule = `{
            background: ${options.color}!important;
        }`
        addStyle(`.${className}`, rule)
        element.classList.add(className)
    }
    function setAttributes(element, attrs) {
        Object.entries(attrs).forEach(([attr, attName]) => {
            element.setAttribute(attr, attName)
        })
    }
    function addStyle(selector, rule) {
        if (!styleCache.has(selector)) {
            styleCache.set(selector, rule)
        }
    }
    // 转换原始元素为骨架DOM元素
    // 遍历整个DOM元素树，获取每一个节点或者说元素，根据元素类型进行转换
    function genSkeleton(options) {
        const rootElement = document.documentElement
        ;(function traverse(options) {
            const { button, image } = options
            const buttons = []
            const imgs = []
            debugger
            ;(function preTraverse(element) {
                if (element.children && element.children.length > 0) {
                    Array.from(element.children).forEach(child => preTraverse(child))
                }
                if (element.tagName === 'BUTTON') {
                    buttons.push(element)
                } else if (element.tagName === 'IMG') {
                    imgs.push(element)
                }
            })(rootElement)
            
            buttons.forEach(item => buttonHandler(item, button))
            imgs.forEach(item => imageHandler(item, image))
        })(options);

        let rules = ''
        for(const [selector, rule] of styleCache) {
            // .sk-button .sk-image
            rules += `${selector} ${rule}\n`
        }
        const styleElement = document.createElement('style')
        styleElement.innerHTML = rules
        document.head.appendChild(styleElement)
    }
    // 获取骨架DOM元素的HTML的字符串和样式
    function getHtmlAndStyle() {
        const styles = Array.from($$('style')).map((style) => style.innerHTML || style.innerText)
        Array.from($$(REMOVE_TAGS.join(','))).forEach(element => {
            element.parentNode.removeChild(element)
        })
        const html = document.body.innerHTML
        return {
            html,
            styles
        }
    }
    return {
        genSkeleton,
        getHtmlAndStyle,
    }
})()