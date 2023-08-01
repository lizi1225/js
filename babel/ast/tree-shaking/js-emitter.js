class JSEmitter {
    constructor() {
    }
    visitNodes(nodes) {
        let str = '';
        for (const node of nodes) {
            str += this.visitNode(node);
        }
        return str;
    }
    visitNode(node) {
        let str = '';
    }
    run(body) {
        let str = '';
        str += this.visitNodes(body);
        return str;
    }
}

module.exports = JSEmitter;