// import { v4 as uuidv4 } from 'uuid';
import { data } from '../data/data';
import { Speech } from './PartsOfSpeech'
import { Phrase } from './Phrase';
import { createGraph } from '../utils/GraphUtils'



const Graph = createGraph();
const irab = Graph.graph;

//zayd he went to masjid
const words = [
  Graph.makeWord({ name: "zayd", pos: Speech.Ism.Noun.PN }),
  Graph.makeWord({ name: "he", pos: Speech.Ism.Pronoun.PRON }),
  Graph.makeWord({ name: "went", pos: Speech.Fil.Verb.V }),
  Graph.makeWord({ name: "to", pos: Speech.Harf.Preposition.P }),
  Graph.makeWord([
    { name: "masjid", pos: Speech.Ism.Noun.PN },
    { name: "his", pos: Speech.Ism.Pronoun.PRON }
  ], "testlabel"),
]

Graph.addWords(words);
const tokens = Graph.getTokenObjects();

const zayd = tokens[0]
const he = tokens[1]
const went = tokens[2]
const to = tokens[3]
const masjid = tokens[4]
const his = tokens[5]



irab.setNode('token-a', zayd)
irab.setNode('token-b', he)
irab.setNode('token-c', went)
irab.setNode('token-d', to)
irab.setNode('token-e', masjid)
irab.setNode('token-i', his)

irab.setNode('phrase-g', { id: 'phrase-g', phrase: Phrase.PP, range: { from: 'to', to: 'his' } })
irab.setNode('phrase-f', { id: 'phrase-f', phrase: Phrase.VS, range: { from: 'went', to: 'his' } })
irab.setNode('phrase-h', { id: 'phrase-h', phrase: Phrase.NS, range: { from: 'he', to: 'his' } })

irab.setEdge('token-e', 'token-d', data.Majroor)
irab.setEdge('phrase-g', 'token-c', data.Mutaalliq)
irab.setEdge('phrase-f', 'token-b', data.Kabr)
irab.setEdge('phrase-h', 'token-a', data.Kabr)
irab.setEdge('token-i', 'token-e', data.MudafIlayhi)

Graph.rangeToTokens(irab.node('phrase-g')) //?

Graph.wordsToString() //?

// Graph.words() //?

Graph.toHead('token-a') //?
Graph.toHead('token-b') //?
Graph.toHead('token-c') //?
Graph.toHead('token-d') //?
Graph.toHead('token-e') //?
Graph.toHead('token-i') //?

Graph.toHead('phrase-g') //?
Graph.toHead('phrase-f') //?
Graph.toHead('phrase-h') //?
irab.node('phrase-g') //?
irab.node('token-a') //?

Graph.getTokens() //?
Graph.getPhrases() //?


export const graphSeed = Graph