import { createStore } from 'vuex'
import { data } from '../data/data';
import Api from '../api/Api';
import GraphModule from './GraphModule.js';


const { Ism, Fil, Harf } = data;
const initialOptions = [Ism, Fil, Harf];

function hasNoTopLevelOptions(values) {
  const strs = initialOptions.map(({ name }) => name);
  return !values.some(({ name }) => strs.includes(name));
}

function getCorrectness(answer, key, state) {
  if (state.check === Check.QUIZ) {
    return ''
  }

  if (!answer) {
    return '';
  }
  if (state.check === Check.SUBMIT) {
    if (!state.submitted) {
      return '';
    }
    if (answer.length === key.length) {
      const equals = !answer.filter(val => {
        return !key.includes(val);
      }).length;
      if (equals) {
        return 'correct'
      }
    }
    return 'incorrect'
  }

  if (state.check === Check.CHANGE) {
    if (answer.length === key.length) {
      const equals = !answer.filter(val => {
        return !key.includes(val);
      }).length;
      if (equals) {
        return 'correct'
      }
      return 'incorrect'
    }
    return '';
  }
  throw new Error("Unhandled getCorrectness check")
}

const Check = Object.freeze({
  SUBMIT: Symbol(''),
  CHANGE: Symbol(''),
  QUIZ: Symbol(''),
})


export const seed = (seedData = {}, graphModuleData = {}) => createStore({
  strict: true,
  modules: {
    Graph: GraphModule(graphModuleData),
  },
  state: {
    activeSentenceId: null,
    activeWordId: null,
    activeAnswerId: null,
    check: Check.CHANGE,
    submitted: false,
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
    answerKey: {
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
    setSubmitted(state, bool) {
      state.submitted = bool;
    },
    setState(state, data) {
      state.activeSentenceId = data.activeSentenceId
      state.sentences = data.sentences;
      state.words = data.words;
      state.answerKey = data.answerKey;
      state.answers = data.answers;
    }
  },
  actions: {
    fetch({ commit }) {
      Api.fetchData().then(data => {
        commit('setState', data);
      })
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
      return state.answers.byId[id];
    },
    findAnswerKey: state => id => {
      return state.answerKey.byId[id];
    },
    findWord: state => id => {
      return state.words.byId[id] || [];
    },
    findSentence: (state, getters) => id => {
      const sentence = state.sentences.byId[id] || { words: [] };
      const words = sentence.words.map(wordId => {
        const word = getters.findWord(wordId);
        const answerable = word.answers[id].answerable;
        const answer = getters.findAnswer(word.answers[id].key);
        const answerKey = getters.findAnswerKey(word.answers[id].answerKey);
        const hideAnswer = !!word.answers[id].hideAnswer;


        if (answer && !answerable) {
          console.log(word);
          throw new Error('Nonanswerble word should not have answer')
        }
        if (!answer && answerable) {
          console.log(word);
          throw new Error('Word is answerable but has no key')
        }
        if (!hideAnswer && !answerKey) {
          console.log(word);
          throw new Error('Missing answer key')
        }

        const correctness = getCorrectness(answer, answerKey, state);

        return { ...word, answer, answerable, answerKey, hideAnswer, correctness };
      });
      return { ...sentence, words };
    },
    list(state) {
      return state.sentences.allIds.map(id => state.sentences.byId[id]);
    },
    checkType(state) {
      if (state.check === Check.SUBMIT) {
        return "SUBMIT"
      }
      if (state.check === Check.CHANGE) {
        return "CHANGE"
      }
      if (state.check === Check.QUIZ) {
        return "QUIZ"
      }
    },
  }
})

export default seed();