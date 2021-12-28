export default {
    props: {
        to: {
            type: String,
        }
    },
    render() {
        const handler = () => {
            this.$router.push(this.to)
        }
        return <a onClick={handler}>{this.$slots.default}</a>
    }
}