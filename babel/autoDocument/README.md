## 背景
公共API改动比较频繁（原因是之前工具方法内部封装的不完善或者是进行一些API的增加或删除），每次都要手动改动文档比较麻烦，所以就写个babel插件来做这个事情

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

3. 版本升级
babel插件 -> 支持ts -> Nodejs工具

4. 难点
- 要不要处理import导入的文件，ts的接口、类型需要处理，但处理了可能会将一些不必要的方法和类的信息处理进来，又由于api各个文件可能有依赖关系，也可能没有依赖关系，所以可能会重复处理。
  - babel默认只会处理单个文件，不会处理通过import导入的文件。可以通过babel/parser分析import输入的文件，判断是TSTypeAliasDeclaration和TSInterfaceDeclaration就把内容拿进来，通过Magic-string进行拼接

5. 扩展
- 公共API语法检查，书写不合法则报错（API自动生成文档工具报错不明显）
- 比如组件库文档，业务组件的文档也可以按照这种思路来做。