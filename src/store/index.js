import { createStore } from 'vuex'
import { data } from '../data/data';

const { Ism, Fil, Harf, Mubtada, Kabr, Jar, Majroor } = data;
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
      const sentence = state.sentences.byId[id] || [];
      const words = sentence.words.map(wordId => {
        const word = getters.findWord(wordId);
        const answerable = word.answers[id].answerable;
        const answer = getters.findAnswer(word.answers[id].key);
        const answerKey = getters.findAnswerKey(word.answers[id].answerKey);
        const hideAnswer = !!word.answers[id].hideAnswer;

        if (!answer && answerable) {
          console.log(word);
          throw new Error('Word is answerable but has no key')
        }
        if (!hideAnswer && !answerKey) {
          console.log(word);
          throw new Error('Missing answer key')
        }

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
          answers: { '123': { answerable: false, key: '1', answerKey: '1' } },
          sentences: ['123'],
        },
        2: {
          id: '2',
          name: 'هو',
          answers: { '123': { answerable: true, key: '1', answerKey: '1' } },
          sentences: ['123'],
        },
        3: {
          id: '3',
          name: 'جالسٌ',
          answers: { '123': { answerable: true, key: '2', answerKey: '2' } },
          sentences: ['123'],
        },
        4: {
          id: '4',
          name: 'فِ',
          answers: { '123': { answerable: false, hideAnswer: true, answerKey: '3' } },
          sentences: ['123'],
        },
        5: {
          id: '5',
          name: 'الْمسجدِ',
          answers: { '123': { answerable: true, key: '3', answerKey: '4' } },
          sentences: ['123'],
        },
      },
      allIds: ['1', '2', '3', '4', '5']
    },
    answerKey: {
      byId: {
        1: [Ism, Mubtada],
        2: [Ism, Kabr],
        3: [Harf, Jar],
        4: [Ism, Majroor],
      },
      allIds: ['1', '2', '3', '4'],
    },
    answers: {
      byId: {
        1: [Ism],
        2: [],
        3: [],
      },
      allIds: ['1', '2', '3'],
    }
  }
});