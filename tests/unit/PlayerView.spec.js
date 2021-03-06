import { mount } from '@vue/test-utils'
import { data } from '../../src/data/data.js'
import PlayerView from '@/components/PlayerView.vue'
import { seed } from '../../src/store/index'

const { Ism, Mubtada, Fil } = data

function mkWrapper(data = {}) {
  const wrapper = mount(PlayerView, {
    global: {
      plugins: [seed(data.store)]
    }
  })
  return wrapper;
}
const sentences = {
  byId: {
    123: { words: ['1', '2', '3', '4', '5'] }
  },
  allIds: ['123'],
}
const words = {
  byId: {
    1: {
      id: '1',
      name: 'arabic',
      answers: { '123': { answerable: true, key: '5', answerKey: '1' } },
      sentences: ['123'],
    },
    2: {
      id: '2',
      name: 'word',
      answers: { '123': { answerable: true, key: '6', answerKey: '1' } },
      sentences: ['123'],
    },
    3: {
      id: '3',
      name: 'word',
      answers: { '123': { answerable: true, key: '7', answerKey: '1' } },
      sentences: ['123'],
    },
    4: {
      id: '4',
      name: 'word',
      answers: { '123': { answerable: false, answerKey: '1' } },
      sentences: ['123'],
    },
    5: {
      id: '5',
      name: 'word',
      answers: { '123': { answerable: false, hideAnswer: true, answerKey: '1' } },
      sentences: ['123'],
    },
  },
  allIds: ['1', '2', '3', '4', '5']
}
const answers = {
  byId: {
    5: [Ism, Mubtada],
    6: [Fil],
    7: [],
    8: [],
  },
  allIds: ['5', '6'],
};
const answerKey = {
  byId: {
    1: [Ism],
  },
  allIds: ['5', '6'],
};

let wrapper
beforeEach(() => {
  wrapper = mkWrapper({
    store: {
      state: {
        activeSentenceId: '123',
        activeWordId: '1',
        sentences,
        words,
        answers,
        answerKey,
      }
    }
  });
})

test('renders words', async () => {
  expect(wrapper.findAll('.arabic').length).toBeGreaterThan(2);
})

test('renders question mark for word that needs answer', async () => {
  const third = wrapper.find('[data-token="3"]')
  expect(third.html()).toContain('?');
})

test('does not render question mark for word that doesnt need answer', async () => {
  const fourth = wrapper.findAll('[data-token="4"]')
  const property = wrapper.findAll('[data-token="4"] [data-test=properties]')

  expect(fourth[0].html()).not.toContain('?');
  expect(property.length).toBe(1);
})

test('does not any property messaging', async () => {
  const fourth = wrapper.findAll('[data-token="5"]')
  const property = wrapper.findAll('[data-token="5"] [data-test=properties]')

  expect(fourth[0].html()).not.toContain('?');
  expect(property.length).toBe(0);
})

test('sets properties for tokens', async () => {
  const first = wrapper.findAll('[data-token="1"] [data-test=property]')
  const second = wrapper.findAll('[data-token="2"] [data-test=property]')

  expect(first[0].text()).toBe('Ism');
  expect(first[1].text()).toBe('Mubtada');
  expect(second[0].text()).toBe('Fil');
})

test('defaults to first token being selected', async () => {
  const tokenViews = wrapper.findAllComponents({ name: 'TokenView' });

  expect(tokenViews[0].classes()).toContain('selected');
  expect(tokenViews[1].classes()).not.toContain('selected');
})

test('switch active token to clicked token', async () => {
  const tokenViews = wrapper.findAllComponents({ name: 'TokenView' });
  await tokenViews[1].trigger('click')

  expect(tokenViews[0].classes()).not.toContain('selected');
  expect(tokenViews[1].classes()).toContain('selected');
})

test('switch active token to clicked token when no token is selected', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        activeSentenceId: '123',
        sentences,
        words,
        answers,
        answerKey,
      }
    }
  });

  const tokenViews = wrapper.findAllComponents({ name: 'TokenView' });
  await tokenViews[1].trigger('click')

  expect(tokenViews[0].classes()).not.toContain('selected');
  expect(tokenViews[1].classes()).toContain('selected');
})