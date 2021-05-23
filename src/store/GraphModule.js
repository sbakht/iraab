import { loadGraph } from '../utils/GraphUtils'
import { v4 as uuidv4 } from 'uuid';
import Api from '../api/Api';
import { data } from '../data/data';

function rangeToWords(tokens, { from, to }) {
  const result = []
  const words = [] //?
  let started = false;

  function go(token) {
    let added = false;
    if (token.id === from) {
      started = true;
    }
    if (started) {
      result.push(token);
      added = true;
    }
    if (token.id === to) {
      return { done: true, added };
    }
    return { done: false, added };
  }

  for (let obj of tokens) {
    if (obj.token) {
      const x = go(obj.token);
      if (x.added) {
        words.push(obj)
        if (x.done) {
          return words;
        }
      }
    }
    if (obj.tokens) {
      for (let token of obj.tokens) {
        const x = go(token);
        if (x.added) {
          words.push(obj)
          if (x.done) {
            return words;
          }
          break;
        }
      }
    }
  }
  return words;
}

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
    },
    addConnection(state, { from, to }) {
      const id = 'connection-' + uuidv4();
      state.connections.byId[id] = {
        id,
        from: from.id,
        to: to.id,
        grammar: data.Majroor,
        userAdded: true,
      }
      state.connections.allIds.push(id);
    },
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
    findToken: state => id => {
      return state.tokens.byId[id];
    },
    findWord: (state, getters) => id => {
      const word = state.words.byId[id];
      if (word.token) {
        const token = getters.findToken(word.token);
        return {
          ...word, token, label: token.name
        }
      }
      return {
        ...word, tokens: word.tokens.map(getters.findToken)
      }
    },
    findPhrase(state, getters) {
      return id => {
        const phrase = state.phrases.byId[id];
        const from = getters.findToken(phrase.range.from);
        const to = getters.findToken(phrase.range.to);
        const words = rangeToWords(getters.words, phrase.range)
        const tokens = words.map(word => word.token || word.tokens).flat()

        return { ...phrase, from, to, words, tokens };
      }
    },
    find: (state, getters) => id => {
      if (id.startsWith('phrase')) {
        return getters.findPhrase(id)
      }
      if (id.startsWith('token')) {
        return getters.findToken(id)
      }
    },
    findConnection(state, getters) {
      return id => {
        const connection = state.connections.byId[id];
        const from = getters.find(connection.from)
        const to = getters.find(connection.to)
        return { ...connection, from, to }
      }
    },
    words(state, getters) {
      return state.words.allIds.map(getters.findWord);
    },
    phrases(state, getters) {
      return state.phrases.allIds.map(getters.findPhrase);
    },
    connections(state, getters) {
      return state.connections.allIds.map(getters.findConnection);
    }
  }
})

export default seed;