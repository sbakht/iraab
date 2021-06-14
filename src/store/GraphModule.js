import { loadGraph } from '../utils/GraphUtils'
import Api from '../api/Api';
// import { data } from '../data/data'
import Utils from '../utils/Utils';

// const Type = data;

function rangeToWords(words1, { from, to }) {
  const tokens = words1;
  const result = []
  const words = []
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
    activeSentenceId: 'sentence-1',
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
    sentences: {
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
      state.sentences = data.sentences;
    },
    setActiveSentence(state, id) {
      state.activeSentenceId = id
    },
    addToken(state, token) {
      const id = token.id;
      state.tokens.byId[id] = token;
      state.tokens.allIds.push(id);
    },
    addWord(state, word) {
      const id = word.id;
      const newWord = { ...word };
      if (newWord.token) {
        newWord.token = newWord.token.id;
      }
      if (newWord.tokens) {
        newWord.tokens = Utils.toIds(newWord.tokens)
      }
      state.words.byId[id] = newWord;
      state.words.allIds.push(id);
    },
    addPhrase(state, { from, to, sentenceId, myPhrase }) {
      const id = myPhrase.id
      const phrase = myPhrase.phrase
      state.phrases.byId[id] = {
        id,
        range: {
          from: from.id,
          to: to.id,
        },
        phrase,
        userAdded: true,
      }
      state.phrases.allIds.push(id);

      const sentence = state.sentences.byId[sentenceId];
      sentence.phrases.push(id);
    },
    addConnection(state, { from, to, grammar, id, sentenceId }) {

      state.connections.byId[id] = {
        id,
        from: from.id,
        to: to.id,
        grammar,
        userAdded: true,
      }
      state.connections.allIds.push(id);

      const sentence = state.sentences.byId[sentenceId];
      sentence.connections.push(id);
    },
    updateConnectionGrammar(state, { grammar, id }) {
      const connection = state.connections.byId[id];
      connection.grammar = grammar;
    },
    deleteConnection(state, { id, sentenceId }) {
      delete state.connections.byId[id]
      state.connections.allIds = state.connections.allIds.filter(i => i !== id)

      const sentence = state.sentences.byId[sentenceId];
      sentence.connections = sentence.connections.filter(i => i !== id)
    },
    addSentence(state, sentence) {
      const id = sentence.id;
      state.sentences.byId[id] = sentence;
      state.sentences.allIds.push(id);
    },
    addTokenToWord(state, { word, token }) {
      const stateWord = state.words.byId[word.id];
      if (stateWord.token) {
        stateWord.tokens = [token.id]
        delete stateWord.token;
      } else {
        stateWord.tokens.push(token.id);
      }
    },
  },
  actions: {
    fetch({ commit }) {
      return Api.fetchGraph().then(data => {
        commit('setData', data);
      })
    },
    addPhrase({ commit, getters }, { phrase, sentence }) {
      const id = phrase.id;
      const from = phrase.range.from;
      const to = phrase.range.to;

      commit('addPhrase', { from, to, myPhrase: phrase, sentenceId: sentence.id })
      return getters.findPhrase(id, sentence.id);
    },
    addConnection({ commit, getters }, { connection, sentence }) {
      commit('addConnection', { ...connection, sentenceId: sentence.id })
      return getters.findConnection(connection.id);
    },
    addPhraseAndConnection({ dispatch, getters }, { connection, sentence }) {

      dispatch('addPhrase', { sentence, phrase: connection.from })
      dispatch('addConnection', {
        id: connection.id,
        skipDuplicateCheck: true,
        sentence,
        connection,
      })
      return getters.findConnection(connection.id, sentence.id);
    },
    addSentence({ commit }, sentence) {
      sentence.words.forEach(word => {
        const tokens = Utils.toTokens(word);
        tokens.forEach(token => {
          commit('addToken', token);
        })
        commit('addWord', word);
      })
      const wordIds = Utils.toIds(sentence.words);
      commit('addSentence', { ...sentence, words: wordIds });
    },
    setActiveSentence({ commit }, id) {
      commit('setActiveSentence', id)
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
      return (id, sentenceId) => {
        const phrase = state.phrases.byId[id];
        const from = getters.findToken(phrase.range.from);
        const to = getters.findToken(phrase.range.to);
        const words = rangeToWords(getters.wordsFromSentence(sentenceId), phrase.range)
        const tokens = words.map(word => word.token || word.tokens).flat()

        return { ...phrase, from, to, words, tokens };
      }
    },
    findSentence(state, getters) {
      return id => {
        const sentence = state.sentences.byId[id] || { words: [], connections: [] };
        const words = sentence.words.map(getters.find)
        let connections = [];
        if (sentence.connections) {
          connections = sentence.connections.map(connection => getters.findConnection(connection, id));
        }
        return { ...sentence, words, connections }
      }
    },
    find: (state, getters) => (id, sentenceId) => {
      if (id.startsWith('phrase')) {
        return getters.findPhrase(id, sentenceId)
      }
      if (id.startsWith('token')) {
        return getters.findToken(id)
      }
      if (id.startsWith('word')) {
        return getters.findWord(id)
      }
    },
    findConnection(state, getters) {
      return (id, sentenceId) => {
        const connection = state.connections.byId[id];
        const from = getters.find(connection.from, sentenceId)
        const to = getters.find(connection.to, sentenceId)
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
    },
    activeSentence(state, getters) {
      return getters.findSentence(state.activeSentenceId);
    },
    sentences(state, getters) {
      return state.sentences.allIds.map(getters.findSentence);
    },
    wordsFromSentence(state, getters) {
      return id => {
        const sentence = state.sentences.byId[id] || { words: [] };
        const words = sentence.words.map(getters.find)
        return words;
      }
    },
  }
})

export default seed;