const sum = (a, b) => a + b
console.log(sum(1,2))

const imgUrl = require('./images/1.jpg')
const img = new Image()
img.src = imgUrl
document.body.appendChild(img)
