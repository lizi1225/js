/**
 * 数据范围：不超过1亿
 *  输入一：“一千三”
    输出一：1300
    输入二：“一千三百零一”
    输出二：1301
    输入三：“十二”
    输出三：12
    输入四：“一千三百二十一万一千三百二十一”
    输出四：13211321
 */
function convert(str) {
  let ret = 0
  let nmap = new Map()
  nmap.set('一', 1)
  nmap.set('二', 2)
  nmap.set('三', 3)
  nmap.set('四', 4)
  nmap.set('五', 5)
  nmap.set('六', 6)
  nmap.set('七', 7)
  nmap.set('八', 8)
  nmap.set('九', 9)
  let dmap = new Map()
  dmap.set('零', 1)
  dmap.set('十', 10)
  dmap.set('百', 100)
  dmap.set('千', 1000)
  dmap.set('万', 10000)
  dmap.set('亿', 100000000)
  let temp = 0
  let carry = 1
  /**
   * 前置自增，先自增，后返回原对象的对象；没有产生任何临时对象；而后置自增，先保存原对象，然后自增，最后返回该原临时对象，那么它就需要创建和销毁，这样一来，效率孰高孰低就很清楚了。

    在不进行赋值的情况下，内置类型前置和后置自增的汇编都是一样的！
   */
  for (let i = 0; i < str.length; ++i) {
    if (nmap.has(str[i])) {
      temp += nmap.get(str[i])
    } else {
      if (str[i] === '万' || str[i] === '亿') {
        ret += temp * carry
        temp = 0
        ret *= dmap.get(str[i])
      } else {
        if (temp === 0) {
          temp = 1
        }
        carry = dmap.get(str[i]) / 10
        if (str[i] === '零') {
          carry = 1
        } else {

          ret += temp * dmap.get(str[i])
        }
        temp = 0
      }
    }
  }
  ret += temp * carry
  return ret
}

const input = ['一百二十一万','一百万','一千三百零一', '一千三百二十一万一千三百二十一', '一千三', '零', '三十八万九千零二', '六十六', '十万八', '九千六', '七百万零四百', '七百万', '七千五百万', '十四亿', '一万']

let ret = input.map(it => ([it, convert(it)]))
console.log(ret)