import { data } from '../data/data';
import { Speech } from './PartsOfSpeech'
import { Phrase } from './Phrase';
// import { loadGraph } from '../utils/GraphUtils'
'زيدٌ',
  //         answers: { '123': { answerable: false, answerKey: '1' } },
  //         sentences: ['123'],
  //       },
  //       2: {
  //         id: '2',
  'هو',
  //         answers: { '123': { answerable: true, key: '1', answerKey: '1' } },
  //         sentences: ['123'],
  //       },
  //       3: {
  //         id: '3',
  'جالسٌ',
  //         answers: { '123': { answerable: true, key: '2', answerKey: '2' } },
  //         sentences: ['123'],
  //       },
  //       4: {
  //         id: '4',
  'فِ',
  //         answers: { '123': { answerable: false, hideAnswer: true, answerKey: '3' } },
  //         sentences: ['123'],
  //       },
  //       5: {
  //         id: '5',
  'مَسْجِدِهِ'

const obj = {
  tokens: {
    byId: {
      'token-1': { id: 'token-1', name: 'زيدٌ', pos: Speech.Ism.Noun.PN },
      'token-2': { id: 'token-2', name: "هو", pos: Speech.Ism.Pronoun.PRON },
      'token-3': { id: 'token-3', name: "جالسٌ", pos: Speech.Fil.Verb.V },
      'token-4': { id: 'token-4', name: "فِ", pos: Speech.Harf.Preposition.P },
      'token-5': { id: 'token-5', name: "مَسْجِدِِ", pos: Speech.Ism.Noun.PN },
      'token-6': { id: 'token-6', name: "هو", pos: Speech.Ism.Pronoun.PRON },
    },
    allIds: ['token-1', 'token-2', 'token-3', 'token-4', 'token-5', 'token-6'],
  },
  words: {
    byId: {
      'word-1': { id: 'word-1', token: 'token-1' },
      'word-2': { id: 'word-2', token: 'token-2' },
      'word-fake': { id: 'word-fake', token: 'token-2' },
      'word-3': { id: 'word-3', token: 'token-3' },
      'word-4': { id: 'word-4', token: 'token-4' },
      'word-5': { id: 'word-5', tokens: ['token-5', 'token-6'], label: 'مَسْجِدِهِ' },
    },
    allIds: ['word-1', 'word-2', 'word-fake', 'word-3', 'word-4', 'word-5'],
  },
  sentences: {
    byId: {
      'sentence-1': { order: ['word-1', 'word-2', 'word-3', 'word-4', 'word-5'] },
    },
    allIds: ['sentence-1'],
  },
  phrases: {
    byId: {
      'phrase-1': { id: 'phrase-1', phrase: Phrase.PP, range: { from: 'token-4', to: 'token-6' } },
      'phrase-2': { id: 'phrase-2', phrase: Phrase.VS, range: { from: 'token-3', to: 'token-6' } },
      'phrase-3': { id: 'phrase-3', phrase: Phrase.NS, range: { from: 'token-2', to: 'token-6' } },
    },
    allIds: ['phrase-1', 'phrase-2', 'phrase-3'],
  },
  connections: {
    byId: {
      'connection-1': { id: 'connection-1', from: 'token-5', to: 'token-4', grammar: data.Majroor },
      'connection-2': { id: 'connection-2', from: 'token-6', to: 'token-5', grammar: data.MudafIlayhi },
      'connection-3': { id: 'connection-3', from: 'phrase-1', to: 'token-3', grammar: data.Mutaalliq },
      'connection-4': { id: 'connection-4', from: 'phrase-2', to: 'token-2', grammar: data.Kabr },
      'connection-5': { id: 'connection-5', from: 'phrase-3', to: 'token-1', grammar: data.Kabr },
    },
    allIds: ['connection-1', 'connection-2', 'connection-3', 'connection-4', 'connection-5']
  },
}
// const loaded = loadGraph(obj);

// const phrases = obj.phrases.byId;



// loaded.getLevel(obj.phrases.byId['phrase-3']) //?


// const Graph = createGraph();

// //zayd he went to masjid
// const words = [
//   Graph.makeWord({ name: "zayd", pos: Speech.Ism.Noun.PN }),
//   Graph.makeWord({ name: "he", pos: Speech.Ism.Pronoun.PRON }),
//   Graph.makeWord({ name: "went", pos: Speech.Fil.Verb.V }),
//   Graph.makeWord({ name: "to", pos: Speech.Harf.Preposition.P }),
//   Graph.makeWord([
//     { name: "masjid", pos: Speech.Ism.Noun.PN },
//     { name: "his", pos: Speech.Ism.Pronoun.PRON }
//   ], "his masjid"),
// ]

// Graph.addWords(words);

// const tokens = Graph.getTokenObjects();

// const zayd = tokens[0]
// const he = tokens[1]
// const went = tokens[2]
// const to = tokens[3]
// const masjid = tokens[4]
// const his = tokens[5]

// const phrases = [
//   { phrase: Phrase.PP, range: { from: 'to', to: 'his' } },
//   { phrase: Phrase.VS, range: { from: 'went', to: 'his' } },
//   { phrase: Phrase.NS, range: { from: 'he', to: 'his' } },
// ].map(Graph.makePhrase);

// Graph.addPhrases(phrases);

// Graph.createGrammarLink(masjid, to, data.Majroor)
// Graph.createGrammarLink(his, masjid, data.MudafIlayhi)

// Graph.createGrammarLink(phrases[0], went, data.Mutaalliq)
// Graph.createGrammarLink(phrases[1], he, data.Kabr)
// Graph.createGrammarLink(phrases[2], zayd, data.Kabr)




export const graphSeed = obj
// export const graphSeed = Graph