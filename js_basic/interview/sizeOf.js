 // object-sizeOf库
const testData = {
    a: 111,
    b: 'cccc',
    2222: false,
    xxxx: true
    // c: xxx,
    // d: xxx
}
// number 是64位存储 占8个字节
// string 2个字节
// boolean 4个字节
// 对象调用toString 内存就会变小

const seen = new WeakSet()
function sizeOfObject(object) {
    if (object === null) {
        return 0
    }
    let bytes = 0
    // 对象里的key也是占用内存空间的
    const properties = Object.keys(object)
    for (let i = 0; i < properties.length; i++) {
        const key = properties[i]
        bytes += calculator(key)
        if (typeof object[key] === 'object' && object[key] !== null) {
            if (seen.has(object[key])) {
                continue
            }
            seen.add(object[key])
        }
        bytes += calculator(object[key])
    }
    return bytes
}

// 1. 对于计算机基础，js内存基础的考察 2. 递归 3.细心
function calculator(object) {
    const objectType = typeof object
    switch(objectType) {
        case 'string': {
            return object.length * 2
        }
        case 'number': {
            return 8
        }
        case 'boolean': {
            return 4
        }
        case 'object': {
            if (Array.isArray(object)) {
                return object.map(calculator).reduce((memo, current) => memo + current, 0)
            } else {
                return sizeOfObject(object)
            }
        }
        default: {
            return 0
        }
    }
}

console.log(calculator(testData))