import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import './index.css';
// import Vue from 'vue';
import VueKonva from 'vue3-konva'

// Vue.use(VueKonva)


createApp(App).use(store).use(VueKonva).mount('#app')
