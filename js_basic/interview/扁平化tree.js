let arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 },
];

const map = arr.reduce((memo, current) => {
  memo[current.pid] = memo[current.pid]
    ? memo[current.pid].concat(current)
    : [current];
  return memo;
}, {});

console.log(map);

const res = arr.reduce((memo, current) => {
  if (current.pid === 0) {
    memo.push(current)
  }
  current.children = (current.children || []).concat(map[current.id] || [])
  return memo;
}, []);
console.log(JSON.stringify(res, null, 2));