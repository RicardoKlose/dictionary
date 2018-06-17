// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import App from './App';
import router from './router';
import store from './store';
import './assets/icons/material-icons.css';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(MuseUI);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
