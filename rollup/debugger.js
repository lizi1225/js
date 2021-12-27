const path = require('path')
const rollup = require('./lib/rollup')
const entry = path.resolve(__dirname, 'src/main.js')
debugger
rollup(entry, 'bundle.js')