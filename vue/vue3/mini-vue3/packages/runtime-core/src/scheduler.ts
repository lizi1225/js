const queue = []
let isFlushing = false
const resolvePromise = Promise.resolve()
export function queueJob(job) {
    if (!queue.includes(job)) {
        queue.push(job)
    }
    if (!isFlushing) {
        isFlushing = true
        resolvePromise.then(() => {
            isFlushing = false
            const copy = queue.slice(0)
            queue.length = 0
            for(let i = 0; i < copy.length; i++) {
                copy[i]()
            }
            copy.length = 0
        })
    }
}