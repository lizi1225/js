function debounce(fn, delay) {
    let timer = null
    
    return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

function debounce1(fn, delay, leading) {
    let timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)

        if (leading) {
            let invoked = false
            if (!timer) {
                invoked = true
                fn.apply(this, args)
            }
            timer = setTimeout(() => {
                timer = null
                if (!invoked) {
                    fn.apply(this, args)
                }
            }, delay)
        }

        timer = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

function throttle(fn, delay) {
    let last = 0, timer = null
    return function (...args) {
        if (timer) clearTimeout(timer)
        const now = Date.now()
        const remaining = delay - (now - last)
        if (remaining >= 0) {
            timer = setTimeout(() => {
                fn.apply(this, args)
                timer = null
                last = now
            }, delay)
        } else {
            fn.apply(this, args)
            last = now
        }
    }
}