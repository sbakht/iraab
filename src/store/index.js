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
    sentences: [],
    userAnswers: [],
    ...seedData.state,
  },
  mutations: {
    addToAnswer(state, { addition }) {
      const value = state.userAnswers[state.answerIndex] || [];
      const newVal = [...value, addition];
      state.userAnswers[state.answerIndex] = newVal
    },
    removeFromAnswer(state, { removal }) {
      const value = state.userAnswers[state.answerIndex];
      const newVal = value.filter(({ name }) => name !== removal.name);
      state.userAnswers[state.answerIndex] = newVal;

      if (hasNoTopLevelOptions(newVal)) {
        state.userAnswers[state.answerIndex] = [];
      }
    },
    setAnswerIndex(state, i) {
      state.answerIndex = i
    }
  },
  getters: {
    currentAnswer(state) {
      return state.userAnswers[state.answerIndex] || []
    }
  }
})

export default seed();