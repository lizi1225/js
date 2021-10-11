## 0.0.42
`function foo(...args){}; foo();` => `function foo(){}; foo();`
`function foo(a, ...args){console.log(a);}; foo();` => `function foo(a ){console.log(a);}; foo();`
`function foo({ a }){}; foo();` => `function foo(){}; foo();`

## 0.0.43
检测规则由`eslint`的`no-unused-vars`改为`eslint-plugin-deadvars`的`dead-vars`

## 0.0.44
`eslint-plugin-deadvars`版本从1.0.1升级到1.0.3

## 0.0.45
去掉`AssignmentPattern`的`hasSideEffect`限制

## 0.0.46
增加`AssignmentPattern`的`hasSideEffect`限制

## 0.0.47
`after-used`去掉删除变量后面`,`的逻辑

## 0.0.48
`after-used`修改（删除变量后面`,`的逻辑）

## 0.0.49
- Property：当属性和函数参数都只有一个时，删除解构体。比如`const foo = ({ a }) => {}`=> `const foo = () => {}`
- TSInterfaceDeclaration: 去掉其删除逻辑

## 0.0.50
增加修复规则：
- `const foo = (a, {b}) => {console.log(a)}; foo();` => `const foo = (a ) => {console.log(a)}; foo();`

## 0.0.51
增加修复规则：
- `var {a = 'c', b} = c; b;` => `var { } = c; b;`
- `const foo = test(a => {}); foo();` => `const foo = test(() => {}); foo();`

## 0.0.52
- TSInterfaceDeclaration: 增加其删除逻辑

## 删除可能出现副作用的情况
- const {a} = b()
- const {a = b()} = c
