<template>
  <div id="app">
   <div>a: {{$store.state.a}}</div>
   <div>b: {{$store.getters.b}}</div>
   <div>b: {{$store.getters.b}}</div>
   <div>b: {{$store.getters.b}}</div>
   <!-- {{$store}} -->
   <button @click="handleClick">修改</button>
   <br>
   <button @click="$store.commit('A/updateA', 10)">+10 mutation</button>
   <button @click="$store.dispatch('B/updateA', 20)">+20 action</button>
   <div>moduleA: {{ $store.state.A.a }}</div>
   <div>moduleB: {{ $store.state.B.a }}</div>
   <div>moduleC: {{ $store.state.E }}</div>
   <div>moduleC: {{ $store.getters.getStateA }}</div>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  created() {
    console.log(this.$store)
  },
  methods: {
    handleClick() {
      this.$store.state.a += 100
    }
  }
}
</script>

<style lang="less">
</style>
