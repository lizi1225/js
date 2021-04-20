// 通过promise实现并发控制
function limitLoad(urls, handler, limit) {
    const sequences = [].concat(urls)
    const promises = sequences.splice(0, limit).map((url, index) => {
        return handler(url).then(() => index)
    })
    let p = Promise.race(promises)
    for(let i = 0; i < sequences.length; i++) {
        p = p.then(res => {
            promises[res] = handler(sequences[i]).then(() => res)
            return Promise.race(promises)
        })
    }

}

const urls = [
    {
        info: 'link1',
        time: 3000,
    },
    {
        info: 'link2',
        time: 2000,
    },
    {
        info: 'link3',
        time: 5000,
    },
    {
        info: 'link4',
        time: 2000,
    },
    {
        info: 'link5',
        time: 12000,
    },
    {
        info: 'link6',
        time: 2000,
    },
    {
        info: 'link7',
        time: 300,
    },
    {
        info: 'link8',
        time: 3000,
    },
]

// 设置我们要执行的任务
function loadImg(url) {
    return new Promise((resolve, reject) => {
        console.log("---" + url.info + " start!")
        setTimeout(() => {
            console.log(url.info + ' OK!!!')
            resolve()
        }, url.time)
    })
}

limitLoad(urls, loadImg, 3)