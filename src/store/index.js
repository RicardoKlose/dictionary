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
    initStore(state) {
      state.dics = {};
    },
    initDic(state, { dicName, dic }) {
      Vue.set(state.dics, dicName, [dic]);
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
    editTitle(state, { dicName, title }) {
      state.dics[dicName].slice(-1)[0].title = title;
    },
    editNode(state, { dicName, nowNode, node }) {
      const { children } = state.dics[dicName].slice(-1)[0];
      const nodeIndex = children.indexOf(nowNode);
      if (nodeIndex === -1) {
        return;
      }
      const editNode = children[nodeIndex];
      Object.entries(node).forEach(([key, value]) => {
        editNode[key] = value;
      });
    },
    removeNodeFromChildren(state, { dicName, node }) {
      const { children } = state.dics[dicName].slice(-1)[0];
      const nodeIndex = children.indexOf(node);
      if (nodeIndex === -1) {
        return;
      }
      children.splice(nodeIndex, 1);
    },
    saveDic(state) {
      const dics = {};
      Object.entries(state.dics).forEach(([name, [dic]]) => {
        dics[name] = dic;
      });
      localStorage.setItem('lastDics', JSON.stringify(dics));
    },
  },
  actions: {
    nodeOperate({ commit }, { optName, payLoad }) {
      commit(optName, payLoad);
      commit('saveDic');
    },
    loadDic({ commit }) {
      let lastDics = localStorage.getItem('lastDics');
      if (!lastDics) {
        return;
      }
      lastDics = JSON.parse(lastDics);
      Object.entries(lastDics).forEach(([name, dic]) => {
        commit('initDic', { dicName: name, dic });
      });
    },
  },
});
