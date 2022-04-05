const render = () => {
    const title = require('./title')
    document.getElementById('root').innerText = title
}
render()
if (module.hot) {
    debugger
    module.hot.accept(['./title.js'], render)
}