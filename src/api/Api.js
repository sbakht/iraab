import { seed } from './Seed';

export default {
  fetchData() {
    return new Promise((resolve) => {
      setTimeout(resolve(seed), 500);
    })
  }
}