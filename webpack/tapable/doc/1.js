const fn = new Function('name', 'age', 'return name + age')
console.log(fn(1, 2))