import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import dictionaryNode from '@/components/dictionaryNode';
import store from '../store';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/dics/:dicName',
      name: 'dictionary',
      component: dictionaryNode,
      props: route => ({ dicName: route.params.dicName }),
      beforeEnter(to, from, next) {
        const { dicName } = to.params;
        if (!store.getters.dicExists(dicName)) {
          return next('/');
        }
        return next((vm) => {
          vm.$store.commit('enterDic', { dicName });
        });
      },
    },
  ],
});
