import { createApp } from 'vue'
import App from './App.vue'
import '@/styles/index.scss'
import { Lazyload } from 'vant'
{{#if router}}
import router from './router'
{{/if}}
{{#if vuex}}
import store from './store'
{{/if}}

createApp(App).use(Lazyload)
{{#if vuex}}
.use(store)
{{/if}}
{{#if router}}
.use(router)
{{/if}}
.mount('#app')
