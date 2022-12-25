const path = require('path')

function resolve(curPath) {
    let p = 0, last = curPath.length
    const paths = []
    // node_modules character codes reversed
    const nmChars = [115, 101, 108, 117, 100, 111, 109, 95, 101, 100, 111, 110]
    const s = 'node_modules'
    const len = s.length
    for(let i = curPath.length - 1; i >= 0; i--) {
        const code = curPath.charCodeAt(i)
        if (code === 92) {
            if (p !== len) {
                paths.push(path.resolve(curPath.slice(0, last), 'node_modules'))
            }
            last = i
            p = 0
        } else if (p !== -1) {
            if (code === nmChars[p]) {
                p++
            } else {
                p = -1
            }
        }
    }
    return paths

}

// e:\github\js\framework\cli
// console.log(resolve(process.cwd()))
// const os = require('os')

// console.log(os.homedir())
// console.log(process.version)

var findDuplicates = function(nums) {
    const res = [], n = nums.length
    for(let i = 0; i < n; i++) {
        const cur = nums[i]
        if (cur === i) continue
        if (nums[cur] !== cur) {
            swap(nums, i, cur)
            if (nums[cur] > i) i--
        } else {
            res.push(cur)
        }
    }
    return res
};
function swap(nums, i, j) {
     const t = nums[j]
     nums[j] = nums[i]
     nums[i] = t
}
// console.log(findDuplicates([1,3,2,4,3,7,6,4,5]))
// console.log(findDuplicates([1]))


function sort(versions) {
    return versions.sort((a, b) => {
        const versionArr1 = a.split('.')
        const versionArr2 = b.split('.')

        let i = 0
        while(true) {
            const item1 = versionArr1[i]
            const item2 = versionArr2[i]
            i++

            if (item1 === undefined || item2 === undefined) {
                return versionArr2.length - versionArr1.length
            }

            if (item1 === item2) continue
            return item2 - item1
        }
    })
}

console.log(sort(['1.1.1', '3.2.1', '1.1.0', '4.2.0', '3.2.1.2']))