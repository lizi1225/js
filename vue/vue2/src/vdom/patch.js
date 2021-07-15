export function patch(oldVnode, vnode) {
    // 如果是组件 这个oldVnode是undefined
    if(!oldVnode) {
        return createElm(vnode)
    }

    if (oldVnode.nodeType === 1) {
        // 将虚拟节点转化为真实节点
        const el = createElm(vnode)
        const parentElm = oldVnode.parentNode
        parentElm.insertBefore(el, oldVnode.nextSibling)
        parentElm.removeChild(oldVnode)
        return el
    }
    // 标签不一样 直接替换
    if (oldVnode.tag !== vnode.tag) {
        return oldVnode.el.parentNode.replaceChild(createElm(vnode), oldVnode.el)
    }

    if (!oldVnode.tag) { // 文本的比对 两个都是undefined
        if (oldVnode.text !== vnode.text) {
            return oldVnode.el.textContent = vnode.text
        }
    }
    // 标签一样 比对标签的属性和儿子
    const el = vnode.el = oldVnode.el
    updateProperties(vnode, oldVnode.data)
    // 比较儿子
    const oldChildren = oldVnode.children || []
    const newChildren = vnode.children || []

    if (oldChildren.length > 0 && newChildren.length > 0) {
        updateChildren(oldChildren, newChildren, el)
    } else if (oldChildren.length > 0) { // 新的没有
        el.innerHTML = ''
    } else if (newChildren.length > 0) { // 老的没有
        for (let i = 0; i < newChildren.length; i++) {
            let child = newChildren[i]
            el.appendChild(createElm(child))
        }
    }

}

function isSameVnode(oldVnode, newVnode) {
    return (oldVnode.tag === newVnode.tag) && (oldVnode.key === newVnode.key)
}

function updateChildren(oldChildren, newChildren, parent) {
    // vue中的diff做了很多的优化
    // dom中有很多常见的逻辑 把节点插入到当前元素的头部、尾部 正序倒序
    let oldStartIndex = 0
    let oldStartVnode = oldChildren[0]
    let oldEndIndex = oldChildren.length - 1
    let oldEndVnode = oldChildren[oldEndIndex]


    let newStartIndex = 0
    let newStartVnode = newChildren[0]
    let newEndIndex = newChildren.length - 1
    let newEndVnode = newChildren[newEndIndex]

    function makeIndexByKey(children) {
        const map = {}
        // {A:0,B:1,C:2}
        children.forEach((item, index) => {
            if (item.key) {
                map[item.key] = index
            }
        })
        return map
    }
    const map = makeIndexByKey(oldChildren)

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldStartIndex]
        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex]
        } else if (isSameVnode(oldStartVnode, newStartVnode)) {
            patch(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode)
            parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode)
            parent.insertBefore(oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else {
            // 暴力比对
            const moveIndex = map[newStartVnode.key]
            if (moveIndex === undefined) {
                parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
            } else {
                const moveVNode = oldChildren[moveIndex]
                oldChildren[moveIndex] = null
                parent.insertBefore(moveVNode.el, oldStartVnode.el)
                patch(moveVNode, newStartVnode)
            }
            newStartVnode = newChildren[++newStartIndex]
        }
    }
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++) {
            // parent.appendChild(createElm(newChildren[i]))
            // parent.insertBefore()
            const ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el
            parent.insertBefore(createElm(newChildren[i]), ele)
        }
    }

    if (oldStartIndex <= oldEndIndex) {
        for (; oldStartIndex <= oldEndIndex; oldStartIndex++) {
            const child = oldChildren[oldStartIndex]
            if (child != undefined) {
                parent.removeChild(child.el)
            }
        }
    }

}
function createComponent(vnode) {
    // 调用hook中的init方法
    let i = vnode.data
    if((i = i.hook) && (i = i.init)) {
        i(vnode)
    }
    if(vnode.componentInstance) {
        return true
    }
}


export function createElm(vnode) {
    const {
        tag,
        children,
        key,
        data,
        text
    } = vnode
    if (typeof tag === 'string') {
        // 是组件
        if(createComponent(vnode)) {
            return vnode.componentInstance.$el
        }


        vnode.el = document.createElement(tag)
        // 只有元素才有属性
        updateProperties(vnode)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

/**
 * vue的渲染流程：
 * 初始化数据 =》 模板编译 =》变成render函数 =》 生成虚拟节点 =》 
 * 生成真实dom  =》 渲染到页面上（初渲染）
 */


function updateProperties(vnode, oldProps = {}) {
    const newProps = vnode.data || {}

    const el = vnode.el
    // 老的有新的没有 需要删除属性
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.remoteAttribute(key)
        }
    }

    const newStyle = newProps.style || {}
    const oldStyle = oldProps.style || {}

    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }


    // 新的有 直接用新的覆盖老的
    for (let key in newProps) {
        if (key === 'style') {
            for (let styleName in newProps[key]) {
                el.style[styleName] = newProps[key][styleName]
            }
        } else if (key === 'class') {
            el.className = newProps[key]
        } else {
            el.setAttribute(key, newProps[key])
        }
    }
}