const p = function () {
    return new Promise((resolve, reject) => {
        const p1 = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(1)
            }, 0)
            resolve(2)
        })
        p1.then((res) => {
            console.log(res)
        })
        console.log(3)
        resolve(4)
    })
}
p().then((res) => {
    console.log(res)
})
/**
 * 第三方攻击者能否向CA机构申请证书？
 * 那第三方攻击者能否让自己的证书显示出来的信息也是服务端呢？（伪装服务端一样的配置）
 * 显然这个是不行的，因为当第三方攻击者去CA那边寻求认证的时候CA会要求其提供例如域名的whois信息、域名管理邮箱等证明你是服务端域名的拥有者，
 * 而第三方攻击者是无法提供这些信息所以他就是无法骗CA他拥有属于服务端的域名。
 */