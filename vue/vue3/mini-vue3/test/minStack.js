class MinStack {
    constructor() {
        this.stack = []
        this.stackIndex = []
    }
    push(item) {
        this.stack.push(item)
        const i = this.stack.length - 1
        if (!this.stackIndex.length) {
            this.stackIndex.push(i)
            return
        }
        for(let j = this.stackIndex.length - 1; j >= 0; j--) {
            const cur = this.stackIndex[j]
            if (this.stack[cur] > item) {
                this.stackIndex.splice(j + 1, 0, i)
                return
            }
        }
        this.stackIndex.unshift(i)
    }
    getMin() {
        return this.stack[this.stackIndex[this.stackIndex.length - 1]]
    }
    pop() {
        const i = this.stack.length - 1
        this.stack.pop()
        for(let j = 0; j < this.stackIndex.length; j++) {
            if (i === this.stackIndex[j]) {
                this.stackIndex.splice(j, 1)
                return
            }
        }
    }
    top() {
        return this.stack[this.stack.length - 1]
    }
}
// [-2, 0, -3]
// [1, 0, 2]


// const minStack = new MinStack();
// minStack.push(-2);
// minStack.push(0);
// minStack.push(-3);
// console.log(minStack.getMin()); // 返回 -3.
// minStack.pop();
// console.log(minStack.top()); // 返回 0.
// console.log(minStack.getMin()); // 返回 -2.


class Heap {
    constructor(data) {
        this.data = data
        this.heapify()
    }
    get size() {
        return this.data.length
    }
    heapify() {
        if (this.size < 2) return
        for(let i = 1; i < this.size; i++) {
            this.bubbleUp(i)
        }
    }
    bubbleUp(index) {
        while(index > 0) {
            let parentIndex = (index - 1) >> 1
            if (this.data[parentIndex] >= this.data[index]) return
            this.swap(parentIndex, index)
            parentIndex = index
        }
    }
    swap(i, j) {
        if (i === j) return
        const temp = this.data[i]
        this.data[i] = this.data[j]
        this.data[j] = temp
    }
    poll() {
        if (!this.size) return null
        if (this.size === 1) return this.data[0]
        const res = this.data[0]
        this.bubbleDown(0)
        this.data[0] = this.data.pop()
        return res
    }
    bubbleDown(index) {
        while(index < this.size - 1) {
            const leftIndex = index * 2 + 1, rightIndex = leftIndex + 1
            let findIndex = index
            if (this.data[leftIndex] > this.data[findIndex]) findIndex = leftIndex
            if (this.data[rightIndex] > this.data[findIndex]) findIndex = rightIndex
            if (findIndex === index) break
            this.swap(findIndex, index)
            index = findIndex
        }
    }
}


/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number[]}
 */
 var getLeastNumbers = function(arr, k) {
    const heap = new Heap(arr)
    console.log(heap)
    while(heap.size > k) {
        heap.poll()
    }
    return heap.data
};

getLeastNumbers([0,0,0,2,0,5], 0)


function process(root) {
    if (root == null) return null
    // 先序
    process(root.left)
    // 中序
    process(root.right)
    // 后序
}
