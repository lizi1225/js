// [2,1,2,4,3]
// [4,2,4,-1,-1]
/**
 * vector<int> ans(nums.size()); // 存放答案的数组
    stack<int> s;
    for (int i = nums.size() - 1; i >= 0; i--) { // 倒着往栈里放
        while (!s.empty() && s.top() <= nums[i]) { // 判定个子高矮
            s.pop(); // 矮个起开，反正也被挡着了。。。
        }
        ans[i] = s.empty() ? -1 : s.top(); // 这个元素身后的第一个高个
        s.push(nums[i]); // 进队，接受之后的身高判定吧！
    }
    return ans;
 * @param {*} arr 
 * @returns 
 */
function test(arr) {
    const n = arr.length
    const res = Array(n)
    for(let i = 0; i < n; i++) {
        const cur = arr[i]
        let flag = false
        for(let j = i + 1; j < n; j++) {
            if (arr[j] > cur) {
                res[i] = arr[j]
                flag = true
                break
            }
        }
        if (!flag) {
            res[i] = -1
        }
    }
    return res
}
console.log(test([2,1,2,4,3]))