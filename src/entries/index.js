// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import MuseUI from 'muse-ui';
import Loading from 'muse-ui-loading';
import Toast from 'muse-ui-toast';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui-loading/dist/muse-ui-loading.css';
import App from '../pages/App';
import router from '../router';
import store from '../store';
import '../assets/icons/material-icons.css';

Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(MuseUI);
Vue.use(Loading);
Vue.use(Toast, {
  position: 'top',
  time: 3000,
  closeIcon: 'close',
  close: true,
  successIcon: 'check_circle',
  infoIcon: 'info',
  warningIcon: 'priority_high',
  errorIcon: 'warning',
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
