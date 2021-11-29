// console.log(require('./tsconfig.json'))
const {stat} = require('fs').promises
stat('src').then((...args) => {
  console.log('args', args)
})
.catch((e) => {
  console.log('e', e)
})