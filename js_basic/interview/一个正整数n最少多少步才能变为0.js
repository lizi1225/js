/**
 * 他可以做的变换：
  n - 1
  如果n是2的倍数：n / 2
  如果n是3的倍数：n / 3
数据范围：

count：1到10000
n：1到2的31次幂
输入示范:
2
10
10
输出示范:
4
4
 */

const n = +readline();

let input = [];
for (let i = 0; i < n; ++i) {
  input.push(+readline());
}

const memo = new Map();
memo.set(1, 1);
memo.set(0, 0);

function f(n) {
  if (memo.has(n)) {
    return memo.get(n);
  }
  let a1 = Infinity;
  let a2 = Infinity;
  let a3 = Infinity;
  if (n % 2 === 0) {
    // 右移1等于除2
    a2 = f(n >> 1);
  }
  if (n % 3 === 0) {
    a3 = f(n / 3);
  }
  // 剪枝，如果一直算这个会爆栈
  if (a2 === Infinity || a3 === Infinity) {
    a1 = f(n - 1);
  }
  let ret = Math.min(a1, a2, a3) + 1;
  // 记忆化
  memo.set(n, ret);
  return ret;
}

for (const n of input) {
  print(f(n));
}
