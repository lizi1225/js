export let Vue

export const install = (_Vue, options) => {
    Vue = _Vue
    // 为什么不直接在原型上注入$store? 如果Vue被new两次，一个注入了store，一个没有注入store，
    // 但他们却能共享原型上的$store，不合理
    // 可以用beforeCreate去判断根实例上有没有store属性，有的话就注入$store，而子组件渲染时拿父组件的$store，这样所有组件就都有$store了
    Vue.mixin({
        beforeCreate() {
            const options = this.$options
            if (options.store) {
                this.$store = options.store
            } else if (this.$parent && this.$parent.$store) {
                this.$store = this.$parent.$store
            }
        }
    })
}
