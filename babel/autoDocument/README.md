## 背景
公共API改动比较频繁（原因是之前工具方法封装的不完善或者是进行一些扩展），每次都要手动改动文档比较麻烦，所以就写个babel插件来做这个事情

## 实现过程
1. 明确要提取的内容
- 函数
  - 函数声明前面的注释，FunctionDeclaration leadingComments
  - 提取函数签名，也就是函数的参数、参数类型和返回值类型
- 类
  - leadingComments
  - 类的属性 classProperty 普通属性和静态属性
  - 类的方法 包括constructor、公共方法和静态方法 classMethod

2. 具体实现
- 使用babel/parser解析成ast（ts文件要添加typescript插件），然后用babel/core的遍历方法遍历ast，遍历前先在插件的pre钩子初始化一个全局的file对象中初始化一个docs数组，然后开始遍历，首先找到FunctionDeclaration节点，找到leadingComments，params，以及ts类型和返回值，将这些信息包装成一个对象，这个对象的结构大概是 {type: 'function', name: '',return: '',params: [{ name: '', type}]}存入docs数组中,然后遍历ClassDeclaration节点，找到leadingComments，然后遍历它的classProperty和classMethod，提取出类名、属性名和类型、方法名以及它的参数、类型和返回值，最后再post钩子中用fs-extra写入模板引擎中。
