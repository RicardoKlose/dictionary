import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    dics: {},
  },
  getters: {
    lastNodes: state =>
      ((dicName) => {
        const nodes = state.dics[dicName];
        const nodesLength = nodes.length;
        return state.dics[dicName].map(({ text }, index) =>
          ({ text, step: index + 1, disabled: index + 1 === nodesLength }));
      }),
    nowNode: state => (dicName => state.dics[dicName].slice(-1)[0]),
    dicExists: state => (dicName => !!state.dics[dicName]),
  },
  mutations: {
    initDic(state, { dicName, dic }) {
      state.dics[dicName] = [dic];
    },
    enterDic(state, { dicName }) {
      state.dics[dicName].splice(1);
    },
    enterNode(state, { dicName, node }) {
      state.dics[dicName].push(node);
    },
    jumpBackNode(state, { dicName, step }) {
      state.dics[dicName].splice(step);
    },
    addNodeToChildren(state, { dicName, node }) {
      const { children } = state.dics[dicName].slice(-1)[0];
      children.push(node);
    },
  },
});
