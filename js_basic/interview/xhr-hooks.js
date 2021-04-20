class XhrHook {
    constructor(beforeHooks = {}, afterHooks = {}) {
        this.XHR = window.XMLHttpRequest
    }
}

new XhrHook({
    open: function () {
        console.log('open')
    },
    onload: function () {
        console.log('onload')
    },
    onreadystatechange: function () {
        console.log('onreadystatechange')
    },
    onerror: function () {
        console.log('hook error')
    }
})

var xhr = new XMLHttpRequest()
xhr.open('GET', 'https://www.baidu.com', true)

xhr.send()
xhr.onreadystatechange = function (res) {
    if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(res.responseText)
    }
}