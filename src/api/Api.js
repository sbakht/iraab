import { seed, graphSeed } from './Seed';

export default {
  fetchData() {
    return new Promise((resolve) => {
      setTimeout(resolve(seed), 500);
    })
  },
  fetchGraph() {
    return new Promise((resolve) => {
      setTimeout(resolve(graphSeed), 500);
    })
  }
}