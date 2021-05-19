import { loadGraph } from '../utils/GraphUtils'
import { v4 as uuidv4 } from 'uuid';
import Api from '../api/Api';


export const seed = (seedData = {}) => ({
  namespaced: true,
  state: () => ({
    tokens: {
      byId: {},
      allIds: [],
    },
    words: {
      byId: {},
      allIds: [],
    },
    phrases: {
      byId: {},
      allIds: [],
    },
    connections: {
      byId: {},
      allIds: []
    },
    ...seedData.state,
  }),
  mutations: {
    setData(state, data) {
      state.tokens = data.tokens;
      state.words = data.words;
      state.phrases = data.phrases;
      state.connections = data.connections;
    },
    addToken(state, name) {
      const id = 'token-' + uuidv4()
      state.tokens.byId[id] = { id, name, pos: 'PRO' }
      state.tokens.allIds.push(id);
      console.log(state.tokens)
    }
  },
  actions: {
    fetch({ commit }) {
      return Api.fetchGraph().then(data => {
        commit('setData', data);
      })
    },
    addNode({ commit }) {
      commit('addToken', 'bob')
    }
  },
  getters: {
    graph(state) {
      return loadGraph(state, state.tokens);
    },
    findPhrase(state) {
      return id => {
        return state.phrases.byId[id];
      }
    },
    phrases(state) {
      return state.phrases.allIds.map(id => state.phrases.byId[id]);
    },
    connections(state) {
      return state.connections.allIds.map(id => state.connections.byId[id]);
    }
  }
})

export default seed;