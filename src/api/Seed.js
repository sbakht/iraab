import { v4 as uuidv4 } from 'uuid';
import { data } from '../data/data';
const { Ism, Harf, Mubtada, Kabr, Jar, Majroor } = data;

export const seed = {
  activeSentenceId: '13',
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
        answers: { '123': { answerable: false, answerKey: '1' } },
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

function genWord({ name }) {
  const id = uuidv4();
  return {
    id,
    name,
    answers: {},
    sentences: [],
  };
}

function linkSentenceWord(sentenceId, wordId, answerKeyId) {
  seed.sentences.byId[sentenceId].words.push(wordId);
  seed.words.byId[wordId].sentences.push(sentenceId);
  seed.words.byId[wordId].answers[sentenceId] = { answerKey: answerKeyId }
}

function setAnswerable(sentenceId, wordId, answerable, hideAnswer, answerId) {
  if (hideAnswer && answerable) {
    throw new Error('cannot hide answerable word')
  }
  seed.words.byId[wordId].answers[sentenceId].answerable = answerable
  seed.words.byId[wordId].answers[sentenceId].hideAnswer = hideAnswer
  if (answerable) {
    seed.words.byId[wordId].answers[sentenceId].key = answerId
  }
}

function createAnswer() {
  const id = uuidv4();
  const answer = []
  seed.answers.allIds.push(id);
  seed.answers.byId[id] = answer;
  return id;
}

function createWord({ sentenceId, name, answerable, answerKeyId, answerId = createAnswer() }) {
  const word = genWord({ name })

  seed.words.byId[word.id] = word;
  seed.words.allIds.push(word.id);

  linkSentenceWord(sentenceId, word.id, answerKeyId);
  setAnswerable(sentenceId, word.id, answerable, false, answerId);
}

// search and provide answer key from before (answer key should already have all possibilities, otherwise create on runtime)
// pass in answerId if giving a starting point
createWord({ sentenceId: '123', name: 'bob', answerable: true, answerKeyId: '1' })
createWord({ sentenceId: '123', name: 'bob', answerable: false, answerKeyId: '1' })