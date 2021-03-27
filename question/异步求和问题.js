const addRemote = async (a, b) => new Promise(resolve => {
    setTimeout(() => resolve(a + b), 1000)
  })
  
  // 请实现本地的add方法，调用addRemote，能最优的实现输入数字的加法。
  async function add(...inputs) {
    // 你的实现
    return inputs.reduce(async (memo, current) => {
        memo = await memo
        return await addRemote(memo, current)
    }, Promise.resolve(0))
  
  }
  
  // 请用示例验证运行结果:
  add(1, 2)
    .then(result => {
      console.log(result) // 3
    })
  
  add(3, 5, 2)
    .then(result => {
      console.log(result) // 10
    })