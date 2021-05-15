import { createGraph, fromGraph } from '../utils/GraphUtils'
import Api from '../api/Api';

function read(state) {
  return createGraph(state.graph, state.graphwords, state.phrases);
}

export const seed = (seedData = {}) => ({
  namespaced: true,
  state: () => ({
    graph: {},
    graphwords: [],
    phrases: [],
    ...seedData.state,
  }),
  mutations: {
    setGraph(state, graph) {
      state.graph = fromGraph(graph);
    },
    setWords(state, words) {
      state.graphwords = words
    },
  },
  actions: {
    fetch({ commit }) {
      Api.fetchGraph().then(graph => {
        commit('setGraph', graph.graph);
        commit('setWords', graph.words);
      })
    },
    addNode({ commit, state }, node) {
      const { graph } = read(state);
      graph.setNode(node)
      commit('setGraph', graph)
    }
  },
  getters: {
    graph(state) {
      return read(state);
    }
  }
})

export default seed();