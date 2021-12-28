export default {
    render() {
        console.log(this.$route)
        return <div>{this.$route.path}</div>
    }
}