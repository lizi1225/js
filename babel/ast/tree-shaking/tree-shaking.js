const acorn = require('acorn');
const fs = require('fs');
const JSEmitter = require('./js-emitter');
const args = process.args[2];
const buffer = fs.readFileSync(args).toString();
const body = acorn.parse(buffer).body;
const jsEmitter = new JSEmitter();
const decls = new Map();
const calledDecls = [];
const code = []

body.forEach(node => {
    if (node.type === 'FunctionDeclaration') {
        const code = jsEmitter.run([node]);
        decls.set(jsEmitter.visitNode(node.id), code);
        return;
    }
})