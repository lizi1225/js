const readLine = require('readline-sync')
while(true) {
    let num1 = readLine.question('input num1:')
    let num2 = readLine.question('input num2:')
    const ret = eval(num1 + '+' + num2)
    console.log(ret)
}