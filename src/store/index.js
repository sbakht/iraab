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
    activeQuestionId: '456',
    activeWordId: null,
    activeAnswerId: '456',
    sentences: {
      byId: {},
      allIds: [],
    },
    words: {
      byId: {},
      allIds: [],
    },
    userAnswers: {
      byId: {},
      allIds: [],
    },
    ...seedData.state,
  },
  mutations: {
    addToAnswer(state, { addition }) {
      const oldAnswer = state.userAnswers.byId[state.activeAnswerId] || [];
      let newAnswer = [...oldAnswer, addition];

      if (!state.userAnswers.byId[state.activeQuestionId]) {
        state.userAnswers.byId[state.activeAnswerId] = []
      }
      state.userAnswers.byId[state.activeAnswerId] = newAnswer;
    },
    removeFromAnswer(state, { removal }) {
      const oldAnswer = state.userAnswers.byId[state.activeQuestionId] || [];
      let newAnswer = oldAnswer.filter(({ name }) => name !== removal.name);

      if (hasNoTopLevelOptions(newAnswer)) {
        newAnswer = []
      }
      state.userAnswers.byId[state.activeQuestionId] = newAnswer;
    },
    setFocusedWord(state, word) {
      state.activeAnswerId = word.userAnswer
      state.activeWordId = word.id;
    }
  },
  getters: {
    currentAnswer(state, getters) {
      return getters.findAnswer(state.activeAnswerId) || [];
    },
    findAnswer: state => id => {
      return state.userAnswers.byId[id] || [];
    },
    findWord: state => id => {
      return state.words.byId[id] || [];
    },
    findSentence: (state, getters) => id => {
      const sentence = state.sentences.byId[id] || [];
      const words = sentence.words.map(wordId => {
        const word = getters.findWord(wordId);
        const userAnswer = getters.findAnswer(word.userAnswer);
        return { ...word, userAnswer };
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
    sentences: [[
      {
        id: 1,
        name: "arabic",
        oldAnswer: true,
      },
      {
        id: 2,
        name: "word",
        oldAnswer: true,
      },
    ]]
  }
});