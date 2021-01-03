<template>
  {{#if router}}
  <router-view></router-view>
  {{/if}}
  {{#unless router}}
    <HelloWorld/>
  {{/unless}}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
{{#unless router}}
import HelloWorld from '@/components/HelloWorld'
{{/unless}}
export default defineComponent({
  name: 'App'{{#unless router}},
  components: {
    HelloWorld
  }
  {{/unless}}
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
