import { createStore } from 'vuex'
import { data } from '../data/data';

const { Ism, Fil, Harf, Mubtada, Kabr, Jar } = data;
const initialOptions = [Ism, Fil, Harf];

function hasNoTopLevelOptions(values) {
  const strs = initialOptions.map(({ name }) => name);
  return !values.some(({ name }) => strs.includes(name));
}

export const seed = (seedData = {}) => createStore({
  strict: true,
  state: {
    activeSentenceId: null,
    activeWordId: null,
    activeAnswerId: null,
    sentences: {
      byId: {},
      allIds: [],
    },
    words: {
      byId: {},
      allIds: [],
    },
    answers: {
      byId: {},
      allIds: [],
    },
    ...seedData.state,
  },
  mutations: {
    addToAnswer(state, { addition }) {
      const oldAnswer = state.answers.byId[state.activeAnswerId] || [];
      let newAnswer = [...oldAnswer, addition];

      if (!state.answers.byId[state.activeAnswerId]) {
        state.answers.byId[state.activeAnswerId] = []
      }
      state.answers.byId[state.activeAnswerId] = newAnswer;
    },
    removeFromAnswer(state, { removal }) {
      const oldAnswer = state.answers.byId[state.activeAnswerId] || [];
      let newAnswer = oldAnswer.filter(({ name }) => name !== removal.name);

      if (hasNoTopLevelOptions(newAnswer)) {
        newAnswer = []
      }
      state.answers.byId[state.activeAnswerId] = newAnswer;
    },
    setFocusedWord(state, word) {
      if (word.answers[state.activeSentenceId].answerable) {
        state.activeAnswerId = word.answers[state.activeSentenceId].key
        state.activeWordId = word.id;
      }
    },
    setFocusedSentence(state, id) {
      state.activeSentenceId = id;
      state.activeWordId = null;
      state.activeAnswerId = null;
    },
  },
  getters: {
    currentAnswer(state, getters) {
      return getters.findAnswer(state.activeAnswerId) || [];
    },
    currentSentence(state, getters) {
      return getters.findSentence(state.activeSentenceId) || {};
    },
    findAnswer: state => id => {
      return state.answers.byId[id] || [];
    },
    findWord: state => id => {
      return state.words.byId[id] || [];
    },
    findSentence: (state, getters) => id => {
      const sentence = state.sentences.byId[id] || [];
      const words = sentence.words.map(wordId => {
        const word = getters.findWord(wordId);
        const answerable = word.answers[id].answerable;
        const answer = getters.findAnswer(word.answers[id].key) || [];
        const answerKey = getters.findAnswer(word.answers[id].answerKey) || [];
        const hideAnswer = !!word.answers[id].hideAnswer;
        return { ...word, answer, answerable, answerKey, hideAnswer };
      });
      return { ...sentence, words };
    },
    list(state) {
      return state.sentences.allIds.map(id => state.sentences.byId[id]);
    }
  }
})

export default seed({
  state: {
    activeSentenceId: '123',
    sentences: {
      byId: {
        123: { words: ['1', '2', '3', '4', '5'] }
      },
      allIds: ['123'],
    },
    words: {
      byId: {
        1: {
          id: '1',
          name: 'زيدٌ',
          answers: { '123': { answerable: false, key: '5', answerKey: '5' } },
          sentences: ['123'],
        },
        2: {
          id: '2',
          name: 'هو',
          answers: { '123': { answerable: true, key: '6', answerKey: '5' } },
          sentences: ['123'],
        },
        3: {
          id: '3',
          name: 'جالسٌ',
          answers: { '123': { answerable: true, key: '7', answerKey: '9' } },
          sentences: ['123'],
        },
        4: {
          id: '4',
          name: 'فِ',
          answers: { '123': { answerable: false, hideAnswer: true, answerKey: '10' } },
          sentences: ['123'],
        },
        5: {
          id: '5',
          name: 'الْمسجدِ',
          answers: { '123': { answerable: true, key: '8' } },
          sentences: ['123'],
        },
      },
      allIds: ['1', '2', '3', '4', '5']
    },
    answers: {
      byId: {
        5: [Ism, Mubtada],
        6: [Ism],
        7: [],
        8: [],
        9: [Ism, Kabr],
        10: [Harf, Jar],
      },
      allIds: ['5', '6', '7', '8'],
    }
  }
});