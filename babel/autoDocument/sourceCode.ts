interface IA {
  name: string;
  age: number;
}
const aaa:string = '1'

/**
 * say 你好
 * @param name 名字
 */
 function sayHi (name: string, age: number, a: IA):string {
  console.log(`hi, ${name}`);
  return `hi, ${name}`;
}

/**
* 类测试
*/
class Guang {
  name: string; // name 属性
  constructor(name: string) {
      this.name = name;
  }

  /**
   * 方法测试
   */
  sayHi (): string {
      return `hi, I'm ${this.name}`;
  }
}
