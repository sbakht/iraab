import { createStore } from 'vuex'

export default createStore({
  strict: true,
  state: {
    sentences: [
      {
        id: 1,
        name: 'arabic',
        answer: true,
      },
      {
        id: 2,
        name: 'word',
        answer: true,
      }
    ],
    userAnswers: [],
  },
  mutations: {
    setUserAnswers(state, data) {
      state.userA = data;
    },
    setSentences(state, data) {
      state.sentences = data;
    },
    // updateUserAnswer(state, data) {
    // },
  },
  actions: {
  },
  modules: {
  }
})
