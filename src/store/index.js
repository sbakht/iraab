import { createStore } from 'vuex'
import { data } from '../data/data';

const { Ism, Fil, Harf, mafool, Mubtada, Kabr, Fial, fils, jars } = data;
const initialOptions = [Ism, Fil, Harf];

function hasNoTopLevelOptions(values) {
  const strs = initialOptions.map(({ name }) => name);
  return !values.some(({ name }) => strs.includes(name));
}

export const seed = (seedData = {}) => createStore({
  state: {
    answerIndex: 0,
    activeQuestionId: '456',
    sentences: {
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
      const oldAnswer = (state.userAnswers.byId[state.activeQuestionId] || [])[state.answerIndex] || [];
      const newAnswer = [...oldAnswer, addition];
      if (!state.userAnswers.byId[state.activeQuestionId]) {
        state.userAnswers.byId[state.activeQuestionId] = []
      }
      state.userAnswers.byId[state.activeQuestionId][state.answerIndex] = newAnswer;
    },
    removeFromAnswer(state, { removal }) {
      const oldAnswer = state.userAnswers.byId[state.activeQuestionId] || [];
      let newAnswer = oldAnswer.filter(({ name }) => name !== removal.name);

      if (hasNoTopLevelOptions(newAnswer)) {
        newAnswer = []
      }
      state.userAnswers.byId[state.activeQuestionId] = newAnswer;
    },
    setAnswerIndex(state, i) {
      state.answerIndex = i
    }
  },
  getters: {
    currentAnswer(state, getters) {
      return getters.findAnswer(state.activeQuestionId)[state.answerIndex] || []
    },
    findAnswer: state => id => {
      return state.userAnswers.byId[id] || [];
    },
    findSentence: state => id => {
      return state.sentences.byId[id] || {};
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