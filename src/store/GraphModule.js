import { loadGraph } from '../utils/GraphUtils'
import { v4 as uuidv4 } from 'uuid';
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

function sortTokens(index, items) {
  const cloned = [...items];
  cloned.sort((a, b) => {
    if (index(a) < index(b)) {
      return -1;
    }
    if (index(a) > index(b)) {
      return 1;
    }
  })
  return cloned;
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
    addPhrase(state, { from, to, phrase, id, sentenceId }) {
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
    }
  },
  actions: {
    fetch({ commit }) {
      return Api.fetchGraph().then(data => {
        commit('setData', data);
      })
    },
    addPhrase({ commit, getters, state }, data) {
      const allIds = state.tokens.allIds;
      const indexOf = arr => token => arr.indexOf(token && token.id);
      const index = indexOf(allIds);

      const items = sortTokens(index, data.items)

      const low = items[0];
      const high = items[items.length - 1];

      const inbetween = allIds.slice(index(low), index(high))
      if (indexOf(inbetween)(data.to) > -1) {
        return Promise.reject('Target cannot be within source phrase');
      }

      const id = data.id || 'phrase-' + uuidv4();
      commit('addPhrase', { from: low, to: high, phrase: data.phrase, id, sentenceId: data.sentenceId })
      return getters.findPhrase(id, data.sentenceId);
    },
    addConnection({ commit, getters }, data) {
      function findDuplicate(obj) {
        const connections = getters.connections.filter(con => con.userAdded)

        const myFrom = Utils.toTokens(obj.from);
        const myTo = Utils.toTokens(obj.to);

        for (let connection of connections) {
          const { from, to } = connection;
          const fromTokens = Utils.toTokens(from);
          const toTokens = Utils.toTokens(to);
          const isSameFrom = Utils.isSameArray(fromTokens, myFrom)
          const isSameTo = Utils.isSameArray(toTokens, myTo)
          if (isSameFrom && isSameTo) {
            return connection
          }
        }
      }

      if (!data.skipDuplicateCheck) {
        const duplicate = findDuplicate(data);
        if (duplicate) {
          commit('updateConnectionGrammar', { id: duplicate.id, grammar: data.grammar })
          return duplicate
        }
      }

      const id = data.id || 'connection-' + uuidv4();
      commit('addConnection', { ...data, id })
      return getters.findConnection(id);
    },
    addPhraseAndConnection({ commit, state, dispatch, getters }, obj) {
      const sentence = obj.sentence;
      const myTo = Utils.toTokens(obj.to);

      function findDuplicate(obj) {
        const connections = sentence.connections

        for (let connection of connections) {
          const { from, to } = connection;
          const fromTokens = Utils.toTokens(from);
          const toTokens = Utils.toTokens(to);

          const isSameFrom = Utils.isSameArray(fromTokens, obj.items)
          const isSameTo = Utils.isSameArray(toTokens, myTo)
          if (isSameFrom && isSameTo) {
            return connection
          }
        }
      }

      const duplicate = findDuplicate(obj);
      if (duplicate) {
        commit('updateConnectionGrammar', { id: duplicate.id, grammar: obj.grammar })
        return duplicate
      }

      const phraseId = 'phrase-' + uuidv4();
      const allIds = state.tokens.allIds;
      const indexOf = arr => token => arr.indexOf(token && token.id);
      const index = indexOf(allIds);

      const items = sortTokens(index, obj.items)

      const low = items[0];
      const high = items[items.length - 1];

      const inbetween = allIds.slice(index(low), index(high))
      if (indexOf(inbetween)(obj.to) > -1) {
        return Promise.reject('Target cannot be within source phrase');
      }

      dispatch('addPhrase', { ...obj, id: phraseId })
      const connectionId = 'connection-' + uuidv4();
      dispatch('addConnection', {
        from: { id: phraseId },
        to: obj.to,
        grammar: obj.grammar,
        id: connectionId,
        skipDuplicateCheck: true,
        sentenceId: obj.sentenceId,
      })
      return getters.findConnection(connectionId, obj.sentenceId);
    },
    addSentence({ commit, getters }, sentence) {
      sentence.words.forEach(word => {
        const tokens = Utils.toTokens(word);
        tokens.forEach(token => {
          commit('addToken', token);
        })
        commit('addWord', word);
      })
      const wordIds = Utils.toIds(sentence.words);
      commit('addSentence', { ...sentence, words: wordIds });
      return getters.findSentence(sentence.id);
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