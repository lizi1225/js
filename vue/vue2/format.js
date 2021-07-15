/**
 * 
 * @param {*} timeStamp 服务器时间戳
 */

// function format(timeStamp) {
//     timeStamp instanceof Date ? timeStamp.getTime() : timeStamp
//     // 把时间戳转为date格式
//     const date = new Date(timeStamp)
//     // 获取年份
//     const year = date.getFullYear()
//     // 获取月份
//     const month = date.getMonth() + 1

//     // 现在的时间
//     const nowDate = new Date()
//     // 现在的年份
//     const nowYear = nowDate.getFullYear()
//     // 现在的月份
//     const nowMonth = nowDate.getMonth() + 1

//     if (timeStamp < nowDate.getTime()) {
//         throw new Error('传入的时间必须大于当前时间')
//     }
//     const result = []
//     // 同一年
//     if (year === nowYear) {
//         for (let i = month; i >= nowMonth; i--) {
//             result.push(`${year}/${i}`)
//         }
//         return result
//     } 
//     // 不是同一年 并且年份大于当前年份
//     for(let i = year - 1; i >= nowYear + 1 ; i--) {
//         for(let j = 12; j >= 1; j-- ) {
//             result.push(`${i}/${j}`)
//         }
//     }
//     for(let i = 1; i <= month; i ++) {
//         result.unshift(`${year}/${i}`)
//     }
//     for(let i = 12; i >= nowMonth; i--) {
//         result.push(`${nowYear}/${i}`)
//     }
//     return result

// }
// 生成指定月份的测试函数
// function genDate(year, month) {
//     const date = new Date()
//     date.setFullYear(year),
//         date.setMonth(month)
//     return date
// }
// 2022年4月
// console.log(format(genDate(2022,3)))


function formatTime(startDate, serviceTime) {
    if(!serviceTime) {
        serviceTime = startDate
        startDate = new Date('2019-05-01')
    }
    startDate = startDate instanceof Date ? startDate : new Date(startDate)
    serviceTime = serviceTime instanceof Date ? serviceTime.getTime() : serviceTime
    if (serviceTime < startDate.getTime()) {
        [startDate, serviceTime] = [serviceTime, startDate]
    }
    const date = new Date(serviceTime)
    const year = date.getFullYear()
    const month = date.getMonth() + 1

    const startYear = startDate.getFullYear()
    const startMonth = startDate.getMonth() + 1

    const result = []
    const padStart = target => target.toString().padStart(2, '0') 
    // 同一年
    if (year === startYear) {
        for (let i = month; i >= startMonth; i--) {
            result.push(`${year}-${padStart(i)}`)
        }
        return result
    }
    for (let i = year - 1; i >= startYear + 1; i--) {
        for (let j = 12; j >= 1; j--) {
            result.push(`${i}/${padStart(j)}`)
        }
    }
    for (let i = 1; i <= month; i++) {
        result.unshift(`${year}/${padStart(i)}`)
    }
    for (let i = 12; i >= startMonth; i--) {
        result.push(`${startYear}/${padStart(i)}`)
    }
    return result
}
console.log(formatTime(1608082767000))