import { isString, ShapeFlags } from "@vue/shared"
import { createVnode, isSameVnode, Text } from "./vnode"

export function createRenderer(renderOptions) {
    const {
        insert: hostInsert,
        remove: hostRemove,
        setElementText: hostSetElementText,
        setText: hostSetText,
        parentNode: hostParentNode,
        nextSibling: hostNextSibling,
        createElement: hostCreateElement,
        createText: hostCreateText,
        patchProp: hostPatchProp,
    } = renderOptions
    const normalize = (children, i) => {
        if (isString(children[i])) {
            children[i] = createVnode(Text, null, children[i])
        }
        return children[i]
    }

    const mountChildren = (children, container) => {
        for(let i = 0; i < children.length; i++) {
            const child = normalize(children, i)
            patch(null, child, container)
        }
    }
    const mountElement = (vnode, container, anchor) => {
        const { type, props, children, shapeFlag } = vnode
        const el = vnode.el = hostCreateElement(type)
        if (props) {
            for(let key in props) {
                hostPatchProp(el, key, null, props[key])
            }
        }
        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            hostSetElementText(el, children)
        } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
            mountChildren(children, el)
        }
        hostInsert(el, container, anchor)
    }

    const processText = (n1, n2, container) => {
        if (n1 == null) {
            hostInsert((n2.el = hostCreateText(n2.children)), container)
        } else {
            // 文本的内容变化了
            const el = n2.el = n1.el
            if (n1.children !== n2.children) {
                hostSetText(el, n2.children)
            }
        }
    }
    const patchProps = (oldProps, newProps, el) => {
        for(let key in newProps) {
            hostPatchProp(el, key, oldProps[key], newProps[key])
        }
        for(let key in oldProps) {
            if (newProps[key] == null) {
                hostPatchProp(el, key, oldProps[key], null)
            }
        }
    }

    const unmountChildren = (children) => {
        for(let i = 0; i < children.length; i++) {
            unmount(children[i])
        }
    }
    const patchKeyedChildren = (c1, c2, el) => {
        let i = 0, e1 = c1.length - 1, e2 = c2.length - 1
        // sync from start
        while(i <= e1 && i <= e2) {
            const n1 = c1[i], n2 = c2[i]
            if (isSameVnode(n1, n2)) {
                patch(n1, n2, el)
            } else {
                break
            }
            i++
        }
        // sync from end
        while(i <= e1 && i <= e2) {
            const n1 = c1[e1], n2 = c2[e2]
            if (isSameVnode(n1, n2)) {
                patch(n1, n2, el)
            } else {
                break
            }
            e1--
            e2--
        }
        /**
         * common sequence + mount
         * i比e1大 说明有新增的
         * i和e2之间的是新增的部分
         */
        // 有一方全部比较完毕了，要么就删除，要么就添加
        if (i > e1) {
            if (i <= e2) {
                while(i <= e2) {
                    const nextPos = e2 + 1
                    const anchor = nextPos < c2.length ? c2[nextPos].el : null
                    patch(null, c2[i++], el, anchor)
                }
            }
        } else if (i > e2) {
            if (i <= e1) {
                while(i <= e1) {
                    unmount(c1[i++])
                }
            }
        }
        /**
         * common sequence + unmount
         * i比e2大说明有卸载的
         * i到e1之间的就是要卸载的
         */

        // 优化完毕
        // 乱序比对
    }

    const patchChildren = (n1, n2, el) => {
        const c1 = n1 && n1.children
        const c2 = n2 && n2.children
        const prevShapeFlag = n1.shapeFlag
        const shapeFlag = n2.shapeFlag
        // 文本 空 数组

        if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                unmountChildren(c1)
            }
            if (c1 !== c2) {
                hostSetElementText(el, c2)
            }
        } else {
            if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    // diff算法
                    patchKeyedChildren(c1, c2, el)
                } else {
                    unmountChildren(c1)
                }
            } else {
                if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
                    hostSetElementText(el, '')
                }
                if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
                    mountChildren(c2, el)
                }
            }
        }
    }

    const patchElement = (n1, n2) => {
        const el = n2.el = n1.el
        const oldProps = n1.props || {}
        const newProps = n2.props || {}

        patchProps(oldProps, newProps, el)

        patchChildren(n1, n2, el)
    }
    const processElement = (n1, n2, container, anchor) => {
        if (n1 == null) {
            mountElement(n2, container, anchor)
        } else {
            patchElement(n1, n2)
        }
    }

    const patch = (n1, n2, container, anchor = null) => {
        if (n1 === n2) return
        if (n1 && !isSameVnode(n1, n2)) {
            unmount(n1)
            n1 = null
        }

        const { type, shapeFlag } = n2
        switch (type) {
            case Text:
                processText(n1, n2, container)
                break;
        
            default:
                if (shapeFlag & ShapeFlags.ELEMENT) {
                    // 初次渲染/组件的初次渲染
                    processElement(n1, n2, container, anchor)
                }
                break;
        }
    }
    const unmount = (vnode) => {
        hostRemove(vnode.el)
    }
    const render = (vnode, container) => {
        if (vnode == null) {
            // 卸载
            if (container._vnode) {
                unmount(container._vnode)
            }
        } else {
            // 初始化/更 新逻辑
            patch(container._vnode, vnode, container)
        }
        container._vnode = vnode
    }
    return {
        render
    }
}