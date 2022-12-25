<template>
  <div id="app">
    aa
    <A></A>
  </div>
</template>

<script>
import A from './components/A.vue'
export default {
  name: 'App',
  components: {
    A,
  },
  data() {
    return {
      a: { b: {c:1} }
    }
  },
  provide() {
    return { foo: this.a }
  },
  mounted() {
    setTimeout(() => {
      this.a.b.c = 2
      console.log(this)
    }, 1000);
  }
}
</script>

<style lang="scss">
</style>
