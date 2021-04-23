class Man {
  constructor(name) {
    this.tasks = []
    const task = () => {
      console.log(`Hi! This is ${name}`)
      this.next()
    }
    this.tasks.push(task)
    setTimeout(() => {
      this.next()
    }, 0)
  }
  next() {
    const task = this.tasks.shift()
    task && task()
  }
  sleep(delay) {
    this.schedule(delay, false)
    return this
  }
  sleepFirst(delay) {
    this.schedule(delay, true)
    return this
  }
  schedule(delay, sleepFirst) {
    const task = () => {
      setTimeout(() => {
        console.log(`Wake up after ${delay}`);
        this.next()
      }, delay * 1000)
    }
    if(sleepFirst) {
      this.tasks.unshift(task)
    }else {
      this.tasks.push(task)
    }
    
  }
  eat(food) {
    this.tasks.push(() => {
      console.log(`Eat ${food}~`)
      this.next()
    })
    return this
  }
}
function LazyMan(name) {
  return new Man(name)
}
// LazyMan('Hank')
// LazyMan('Hank').sleep(10).eat('dinner')
// LazyMan('Hank').eat('dinner').eat('supper')
LazyMan('Hank').sleepFirst(5).eat('supper')
/**
 * 1、LazyMan(“Hank”)输出:
    Hi! This is Hank!
  2.LazyMan(“Hank”).sleep(10).eat(“dinner”)输出
    Hi! This is Hank!
    //等待10秒..
    Wake up after 10
    Eat dinner~
  3.LazyMan(“Hank”).eat(“dinner”).eat(“supper”)输出
    Hi This is Hank!
    Eat dinner~
    Eat supper~
  4.LazyMan(“Hank”).sleepFirst(5).eat(“supper”)输出
    //等待5秒
    Wake up after 5
    Hi This is Hank!
    Eat supper
 */