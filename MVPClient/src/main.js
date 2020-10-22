import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import echarts from 'echarts'
// import 'vue2-animate/dist/vue2-animate.min.css';
import animated from "animate.css"
import store from './store'

Vue.config.productionTip = false;

// Vue.prototype.$pageSizeBigOne = true;
Vue.prototype.$store = store;
Vue.prototype.$echarts = echarts;
// console.log(localStorage.getItem('mvpip'));
// console.log(localStorage.getItem('mvplevel'));
// 0 操作  1 只读  2  回放
// Vue.prototype.$level = localStorage.getItem('mvplevel')

Vue.use(ElementUI);
Vue.use(animated)
new Vue({
    store,
    render: h => h(App),
}).$mount('#app');
Vue.config.silent = true;