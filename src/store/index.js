import { createStore } from 'vuex'
import { data } from '../data/data';

const { Ism, Fil, Harf, mafool, Mubtada, Kabr, Fial, fils, jars } = data;
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
      state.activeAnswerId = word.answer
      state.activeWordId = word.id;
    }
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
        return { ...word, answer, answerable };
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
        123: { words: ['1', '2', '3', '4'] }
      },
      allIds: ['123'],
    },
    words: {
      byId: {
        1: {
          id: '1',
          name: 'arabic',
          answers: { '123': { answerable: true, key: '5' } },
          sentences: ['123'],
        },
        2: {
          id: '2',
          name: 'word',
          answers: { '123': { answerable: true, key: '6' } },
          sentences: ['123'],
        },
        3: {
          id: '3',
          name: 'word',
          answers: { '123': { answerable: true } },
          sentences: ['123'],
        },
        4: {
          id: '4',
          name: 'word',
          answers: { '123': { answerable: false } },
          sentences: ['123'],
        },
      },
      allIds: ['1', '2', '3', '4']
    },
    answers: {
      byId: {
        5: [Ism, Mubtada],
        6: [Fil],
      },
      allIds: ['5', '6'],
    }
  }
});