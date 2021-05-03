import { mount } from '@vue/test-utils'
import { data } from '../../src/data/data.js'
import PlayerView from '@/components/PlayerView.vue'

const { Ism, Mubtada, Fil } = data

test('sets properties for tokens', async () => {
  const wrapper = mount(PlayerView, {
    props: {
      tokens: [
        {
          id: 1,
          name: 'arabic',
          answer: true,
        },
        {
          id: 2,
          name: 'word',
          answer: true,
        }
      ]
    },
    data() {
      return {
        userAnswers: [[Ism, Mubtada], [Fil]]
      }
    }
  })

  const first = wrapper.findAll('[data-token="1"] [data-test=property]')
  const second = wrapper.findAll('[data-token="2"] [data-test=property]')

  expect(first[0].text()).toBe('Ism');
  expect(first[1].text()).toBe('Mubtada');
  expect(second[0].text()).toBe('Fil');
})

test('sets properties for tokens', async () => {
  const wrapper = mount(PlayerView, {
    props: {
      tokens: [
        {
          id: 1,
          name: 'arabic',
          answer: true,
        },
        {
          id: 2,
          name: 'word',
          answer: true,
        }
      ]
    },
    data() {
      return {
        userAnswers: [[Ism, Mubtada], [Fil]]
      }
    }
  })

  const first = wrapper.findAll('[data-token="1"] [data-test=property]')
  const second = wrapper.findAll('[data-token="2"] [data-test=property]')
  wrapper.html() // ?

  expect(first[0].text()).toBe('Ism');
  expect(first[1].text()).toBe('Mubtada');
  expect(second[0].text()).toBe('Fil');
})

test('active token should have selected class', async () => {
  const wrapper = mount(PlayerView, {
    props: {
      tokens: [
        {
          id: 1,
          name: 'arabic',
          answer: true,
        },
        {
          id: 2,
          name: 'word',
          answer: true,
        }
      ]
    },
    data() {
      return {
        index: 1
      }
    }
  })

  const tokenViews = wrapper.findAllComponents({ name: 'TokenView' });

  expect(tokenViews[0].classes()).not.toContain('selected');
  expect(tokenViews[1].classes()).toContain('selected');
})