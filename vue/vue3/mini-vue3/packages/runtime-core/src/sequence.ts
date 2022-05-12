export function getSequence(arr) {
    const n = arr.length
    const result = [0]

    let resultLastIndex, start, end, middle
    const p = arr.slice(0)
    for(let i = 0; i < n; i++) {
        const arrI = arr[i]
        if (arrI !== 0) {
            resultLastIndex = result[result.length - 1]
            if (arrI > arr[resultLastIndex]) {
                result.push(i)
                p[i] = resultLastIndex
                continue
            }
            start = 0
            end = result.length - 1
            while(start < end) {
                middle = ((end - start) >> 1) + start
                if (arr[result[middle]] < arrI) {
                    start = middle + 1
                } else {
                    end = middle
                }
            }
            if (arr[result[start]] > arrI) {
                result[start] = i
                p[i] = result[start - 1]
            }
        }
        
    }

    let i = result.length
    let last = result[i - 1]
    while(i-- > 0) {
        result[i] = last
        last = p[last]
    }
    return result
} 