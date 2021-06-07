import { data } from '../data/data';
import { Speech } from './PartsOfSpeech'
import { Phrase } from './Phrase';

const obj = {
  activeSentenceId: 'sentence-1',
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
      'sentence-1': {
        id: 'sentence-1',
        words: ['word-1', 'word-2', 'word-3', 'word-4', 'word-5'],
        connections: ['connection-1', 'connection-2', 'connection-3', 'connection-4', 'connection-5'],
        phrases: ['phrase-1', 'phrase-2', 'phrase-3'],
      },
    },
    allIds: ['sentence-1'],
  },
  phrases: {
    byId: {
      'phrase-1': { id: 'phrase-1', phrase: Phrase.PP, range: { from: 'token-4', to: 'token-6' }, sentence: 'sentence-1' },
      'phrase-2': { id: 'phrase-2', phrase: Phrase.VS, range: { from: 'token-3', to: 'token-6' }, sentence: 'sentence-1' },
      'phrase-3': { id: 'phrase-3', phrase: Phrase.NS, range: { from: 'token-2', to: 'token-6' }, sentence: 'sentence-1' },
    },
    allIds: ['phrase-1', 'phrase-2', 'phrase-3'],
  },
  connections: {
    byId: {
      'connection-1': { id: 'connection-1', from: 'token-5', to: 'token-4', grammar: data.Majroor, sentence: 'sentence-1' },
      'connection-2': { id: 'connection-2', from: 'token-6', to: 'token-5', grammar: data.MudafIlayhi, sentence: 'sentence-1' },
      'connection-3': { id: 'connection-3', from: 'phrase-1', to: 'token-3', grammar: data.Mutaalliq, sentence: 'sentence-1' },
      'connection-4': { id: 'connection-4', from: 'phrase-2', to: 'token-2', grammar: data.Kabr, sentence: 'sentence-1' },
      'connection-5': { id: 'connection-5', from: 'phrase-3', to: 'token-1', grammar: data.Kabr, sentence: 'sentence-1' },
    },
    allIds: ['connection-1', 'connection-2', 'connection-3', 'connection-4', 'connection-5']
  },
}
export const graphSeed = obj