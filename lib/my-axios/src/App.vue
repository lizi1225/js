<template>
  <div>{{ data }}</div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { get } from './axios-use'

const data = reactive({
  a: 1,
  b: 2
})
get(data).then(res => {
      console.log('res', res)
  })
</script>
<style lang="scss">
</style>