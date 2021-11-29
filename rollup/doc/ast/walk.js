function walk(astNode, { enter, leave }) {
    // 对于body 父节点是null
    visit(astNode, null, enter, leave)
}


/**
 * 
 * @param {*} astNode 
 * @param {*} parent 
 * @param {*} enter 
 * @param {*} leave 
 */
function visit(astNode, parent, enter, leave) {
    if (enter) {
        enter.call(null, astNode, parent)
    }
    const childKeys = Object.keys(astNode).filter((key) => typeof astNode[key] === 'object')
    childKeys.forEach((childKey) => {
        const value = astNode[childKey]
        if (Array.isArray(value)) {
            value.forEach((child) => visit(child, astNode, enter, leave))
        } else if (value && value.type){
            visit(value, astNode, enter, leave)
        }
    })
    if (leave) {
        leave.call(null, astNode, parent)
    }
}

module.exports = walk