class JSEmitter {
    constructor() {
    }
    visitVariableDeclaration(node) {
        let str = '';
        str += node.kind + ' ';
        str += this.visitNodes(node.declarations);
        return str + '\n';
    }
    visitVariableDeclarator(node, kind) {
        let str = kind ? (kind + ' ') : '';
        str += this.visitNode(node.id);
        str += '=';
        str += this.visitNode(node.init);
        return str + ';' + '\n';
    }
    visitLiteral(node) {
        return node.raw;
    }
    visitIdentifier(node) {
        return node.name;
    }
    visitBinaryExpression(node) {
        let str = '';
        str += this.visitNode(node.left);
        str += node.operator;
        str += this.visitNode(node.right);
        return str + '\n';
    }
    visitFunctionDeclaration(node) {
        let str = 'function ';
        str += this.visitNode(node.id);
        str += '(';
        for (let paramIndex = 0; paramIndex < node.params.length; paramIndex++) {
            str += this.visitNode(node.params[paramIndex]);
            str += ((node.params[paramIndex] === undefined) ? '' : ',')
        }
        str = str.slice(0, str.length - 1);
        str += '){\n';
        str += this.visitNode(node.body);
        str += '}';
        return str + '\n';
    }
    visitBlockStatement(node) {
        let str = '';
        str += this.visitNodes(node.body);
        return str;
    }
    visitCallExpression(node) {
        let str = '';
        str += this.visitIdentifier(node.callee);
        str += '(';
        for (const arg of node.arguments) {
            str += this.visitNode(arg) + ',';
        }
        str = str.slice(0, -1);
        str += ');';
        return str + '\n';
    }
    visitReturnStatement(node) {
        let str = '';
        str = str + '  return ' + this.visitNode(node.argument);
        return str + '\n';
    }
    visitExpressionStatement(node) {
        return this.visitNode(node.expression);
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
        switch (node.type) {
            case 'VariableDeclaration':
                str += this.visitVariableDeclaration(node);
                break;
            case 'VariableDeclarator':
                str += this.visitVariableDeclarator(node);
                break;
            case 'Literal':
                str += this.visitLiteral(node);
                break;
            case 'Identifier':
                str += this.visitIdentifier(node);
                break;
            case 'BinaryExpression':
                str += this.visitBinaryExpression(node);
                break;
            case 'FunctionDeclaration':
                str += this.visitFunctionDeclaration(node);
                break;
            case 'BlockStatement':
                str += this.visitBlockStatement(node);
                break;
            case 'CallExpression':
                str += this.visitCallExpression(node);
                break;
            case 'ReturnStatement':
                str += this.visitReturnStatement(node);
                break;
            case 'ExpressionStatement':
                str += this.visitExpressionStatement(node);
                break;
        }
        return str;
    }
    run(body) {
        let str = '';
        str += this.visitNodes(body);
        return str;
    }
}

module.exports = JSEmitter;