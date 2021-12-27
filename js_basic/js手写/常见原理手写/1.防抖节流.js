// 防抖
function debounce(fn, delay) {
    let timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

function throttle(fn, delay) {
    let timer = null
    return function (...args) {
        if (!timer) {
            timer = setTimeout(() => {
                fn.apply(this, args)
                timer = null
            }, delay)
        }
    }
}

function throttle(fn, delay) {
    let prevTime = new Date()
    return function (...args) {
        const now = new Date()
        if (now - prevTime >= delay) {
            timer = now
            fn.apply(this, args)
        }
    }
}