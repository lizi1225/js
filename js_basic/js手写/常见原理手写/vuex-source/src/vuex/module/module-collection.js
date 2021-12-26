import { forEachValue } from "../utils"
import Module from "./module"

export default class ModuleCollection{
    constructor(options) {
        this.register([], options)
    }
    // 通过路径 返回一个命名空间
    getNamespace(path) {
        let root = this.root
        return path.reduce((prev, cur) => {
           root = root.getChild(cur)

           return prev + (root.namespaced ? cur + '/' : '')
        }, '')
    }
    /**
     * 格式化后
     * { _raw: '用户定义',_children: {A:{ _raw: '', _children: {}, state: a.state }}, state: root.state
     * }
     * @param {*} options 
     */
     register(path, module) {
        const res = new Module(module)
        module.wrapperModule = res
        if (path.length === 0) {
            this.root = res
        } else {
            const parentModule = path.slice(0, -1).reduce((prev, cur) => {
                return prev.getChild(cur)
            }, this.root)
            parentModule.addChild(path[path.length - 1], res)
            // parentModule._children[path[path.length - 1]] = res
        }
        if (module.modules) {
            forEachValue(module.modules, (moduleName, moduleDefine) => {
                this.register(path.concat(moduleName), moduleDefine)
            })
        }
        return res
    }
}