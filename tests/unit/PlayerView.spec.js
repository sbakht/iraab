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
    123: { words: ['1', '2', '3', '4'] }
  },
  allIds: ['123'],
}
const words = {
  byId: {
    1: {
      id: '1',
      name: 'arabic',
      answers: { '123': { answerable: true, key: '5' } },
      sentences: ['123'],
    },
    2: {
      id: '2',
      name: 'word',
      answers: { '123': { answerable: true, key: '6' } },
      sentences: ['123'],
    },
    3: {
      id: '3',
      name: 'word',
      answers: { '123': { answerable: true } },
      sentences: ['123'],
    },
    4: {
      id: '4',
      name: 'word',
      answers: { '123': { answerable: false } },
      sentences: ['123'],
    },
  },
  allIds: ['1', '2', '3', '4']
}
const userAnswers = {
  byId: {
    5: [Ism, Mubtada],
    6: [Fil],
  },
  allIds: ['5', '6'],
};

test('renders words', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        sentences,
        words,
        userAnswers,
      }
    }
  });

  expect(wrapper.findAll('.arabic').length).toBe(4);
})

test('renders question mark for word that needs answer', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        sentences,
        words,
        userAnswers,
      }
    }
  });

  const third = wrapper.find('[data-token="3"]')
  expect(third.html()).toContain('?');
})

test('does not render question mark for word that doesnt need answer', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        sentences,
        words,
        userAnswers,
      }
    }
  });

  const fourth = wrapper.findAll('[data-token="4"]')
  const property = wrapper.findAll('[data-token="4"] [data-test=properties]')

  expect(fourth[0].html()).not.toContain('?');
  expect(property.length).toBe(0);
})

test('sets properties for tokens', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        sentences,
        words,
        userAnswers,
      }
    }
  });

  const first = wrapper.findAll('[data-token="1"] [data-test=property]')
  const second = wrapper.findAll('[data-token="2"] [data-test=property]')

  expect(first[0].text()).toBe('Ism');
  expect(first[1].text()).toBe('Mubtada');
  expect(second[0].text()).toBe('Fil');
})

test('defaults to first token being selected', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        activeWordId: '1',
        sentences,
        words,
        userAnswers,
      }
    }
  });

  const tokenViews = wrapper.findAllComponents({ name: 'TokenView' });

  expect(tokenViews[0].classes()).toContain('selected');
  expect(tokenViews[1].classes()).not.toContain('selected');
})

test('switch active token to clicked token', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        sentences,
        words,
        userAnswers,
      }
    }
  });

  const tokenViews = wrapper.findAllComponents({ name: 'TokenView' });
  await tokenViews[1].trigger('click')

  expect(tokenViews[0].classes()).not.toContain('selected');
  expect(tokenViews[1].classes()).toContain('selected');
})
