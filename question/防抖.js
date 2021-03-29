// 当持续触发事件的时候，一定时间段内没有再触发事件，事件处理函数才会执行一次（一直往后顺延）
// 场景：input

// 时间戳写法 第一次立即执行
// function throttle(fn, interval) {
//     let startTime = Date.now()
//     return function () {
//         let now = Date.now()
//         if(now - startTime >= interval) {
//             startTime = now
//             fn.apply(this, arguments)
//         }
//     }
// }

// setTimeout 延迟执行
// function throttle(fn, interval) {
//     let timer = null
//     return function () {
//         const context = this
//         const args = arguments
//         if(!timer) {
//             timer = setTimeout(function (){
//                 fn.apply(context, args)
//                 timer = null
//             }, interval)
//         }
//     }
// }

function throttle(fn, delay) {
    let timer = null
    let startTime = Date.now()
    return function() {
        const now = Date.now()
        const remain = delay - (now- startTime)
        const context = this
        const args = arguments
        clearTimeout(timer)
        if(remain <= 0) {
            fn.apply(context, args)
            startTime = now
        }else {
            timer = setTimeout(function(){
                fn.apply(context, args)
            }, remain)
        }
    }
}