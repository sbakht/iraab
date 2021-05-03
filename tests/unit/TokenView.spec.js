import { mount } from '@vue/test-utils'
import { data } from '../../src/data/data.js'
import TokenView from '@/components/TokenView.vue'

const { Ism, Mubtada } = data

test('has arabic text', () => {
  const wrapper = mount(TokenView, {
    props: {
      token: 'arabic'
    }
  })

  expect(wrapper.get('.arabic').text()).toBe('arabic');
})

test('show should ? when no properties and is needs an answer', () => {
  const wrapper = mount(TokenView, {
    props: {
      token: 'arabic',
      answer: true,
    }
  })

  expect(wrapper.get('[data-test=question]').text()).toBe('?');
})

test('show should no labeling when no properties and does not needs an answer', () => {
  const wrapper = mount(TokenView, {
    props: {
      token: 'arabic',
    }
  })

  expect(wrapper.find('[data-test=question]').exists()).toBe(false);
})

test('should list properties', () => {
  const wrapper = mount(TokenView, {
    props: {
      token: 'arabic',
      properties: [
        Ism,
        Mubtada,
      ]
    }
  })

  const properties = wrapper.findAll('[data-test=property]')

  expect(properties[0].text()).toBe('Ism');
  expect(properties[1].text()).toBe('Mubtada');
})

test('should order properties by id', () => {
  const wrapper = mount(TokenView, {
    props: {
      token: 'arabic',
      properties: [
        Mubtada,
        Ism,
      ]
    }
  })

  const properties = wrapper.findAll('[data-test=property]')

  expect(properties[0].text()).toBe('Ism');
  expect(properties[1].text()).toBe('Mubtada');
})

test('should not have selected class', () => {
  const wrapper = mount(TokenView, {
    props: {
      token: 'arabic',
    }
  })

  expect(wrapper.classes()).not.toContain('selected');
})

test('should have selected class', () => {
  const wrapper = mount(TokenView, {
    props: {
      token: 'arabic',
      selected: true,
    }
  })

  expect(wrapper.classes()).toContain('selected');
})