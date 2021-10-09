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