
import { mount } from '@vue/test-utils'
import { graphSeed } from '../../src/api/Seed'
import Component from '@/components/SelectableCreate.vue'
import { seed } from '../../src/store/index'

let seedFromGraph = JSON.parse(JSON.stringify(graphSeed))

const token1 = seedFromGraph.tokens.byId['token-1'].name;
const token2 = seedFromGraph.tokens.byId['token-2'].name;
const token3 = seedFromGraph.tokens.byId['token-3'].name;
const token4 = seedFromGraph.tokens.byId['token-4'].name;
const token5 = seedFromGraph.tokens.byId['token-5'].name;
const token6 = seedFromGraph.tokens.byId['token-6'].name;
const word5 = seedFromGraph.words.byId['word-5'].label;

const activeFromClass = 'active-from'
const activeToClass = 'active-to'

function noActiveClass(wrapper, selector) {
  expect(wrapper.find(selector).classes()).not.toContain(activeFromClass)
  expect(wrapper.find(selector).classes()).not.toContain(activeToClass)
}
function getSelectableConnections(wrapper) {
  return wrapper.findAll('[data-testid=select-connection]')
}

beforeEach(() => {
  seedFromGraph = JSON.parse(JSON.stringify(graphSeed))
})

function mkWrapper(data = {}, rest) {
  const wrapper = mount(Component, {
    global: {
      plugins: [seed({}, data.store)]
    },
    ...rest,
  })
  return wrapper;
}

test('renders text', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  // await wrapper.find('button[data-testid="connection-1"').trigger('click')

  expect(wrapper.text()).toContain(`${token1}${token2}${token3}${token4}${word5}${token5}${token6}`)
})

test('toggles word selection (highlights) on click', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid="word-1"')
  await word.trigger('click')
  expect(wrapper.find('[data-testid="word-1"]').classes()).toContain('selected')

  await word.trigger('click')
  expect(wrapper.find('[data-testid="word-1"]').classes()).not.toContain('selected')
})

test('toggles word selection (highlights) on click of compound word', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid="word-5"')
  await word.trigger('click')
  expect(wrapper.find('[data-testid="word-5"]').classes()).toContain('selected')

  await word.trigger('click')
  expect(wrapper.find('[data-testid="word-5"]').classes()).not.toContain('selected')
})

test('can toggle selection of words next to each other', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid="word-1"')
  const word2 = wrapper.find('[data-testid="word-2"')
  await word.trigger('click')
  await word2.trigger('click')
  expect(word.classes()).toContain('selected')
  expect(word2.classes()).toContain('selected')

  await word.trigger('click')
  expect(word.classes()).not.toContain('selected')
  expect(word2.classes()).toContain('selected')
})

test('can toggle selection of words not next to each other', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid="word-1"')
  const word2 = wrapper.find('[data-testid="word-2"')
  const word3 = wrapper.find('[data-testid="word-3"')
  await word.trigger('click')
  await word3.trigger('click')
  expect(word.classes()).toContain('selected')
  expect(word2.classes()).not.toContain('selected')
  expect(word3.classes()).toContain('selected')

  await word.trigger('click')
  expect(word.classes()).not.toContain('selected')
  expect(word2.classes()).not.toContain('selected')
  expect(word3.classes()).toContain('selected')
})

test('can create a connection by clicking and shift clicking on 2 different words', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid=word-1]')
  const word2 = wrapper.find('[data-testid=word-2]')
  await word.trigger('click')
  await word2.trigger("click", { shiftKey: true });

  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(1);
  expect(wrapper.find('button').text()).toBe('?');
})

test('can create a connection by clicking and shift clicking on 2 different words when shift clicked word is already clicked', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid=word-1]')
  const word2 = wrapper.find('[data-testid=word-2]')
  await word.trigger('click')
  await word2.trigger('click')
  await word2.trigger("click", { shiftKey: true });

  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(1);
  expect(wrapper.find('button').text()).toBe('?');
})

test('shift clicking on a selected word should deselect it', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid=word-1]')
  await word.trigger('click')
  await word.trigger("click", { shiftKey: true });

  expect(word.classes()).not.toContain('selected')
  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(0);
})

test('after creating a connection, should automatically show the connection', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid=word-1]')
  const word2 = wrapper.find('[data-testid=word-2]')
  await word.trigger('click')
  await word2.trigger("click", { shiftKey: true });

  expect(word.classes()).toContain('active-from')
  expect(word2.classes()).toContain('active-to')
  expect(word.classes()).not.toContain('selected')
  expect(word2.classes()).not.toContain('selected')
})

test('should create connection from a range of words including inbetween the selected ones', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid=word-1]')
  const word2 = wrapper.find('[data-testid=word-2]')
  const word3 = wrapper.find('[data-testid=word-3]')
  const word4 = wrapper.find('[data-testid=word-4]')
  await word.trigger('click')
  await word3.trigger("click");
  await word4.trigger("click", { shiftKey: true });

  expect(word.classes()).toContain('active-from')
  expect(word2.classes()).toContain('active-from')
  expect(word3.classes()).toContain('active-from')
  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(1);
})

test('can create a link from a word with nested tokens', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid=word-1]')
  const word5 = wrapper.find('[data-testid=word-5]')
  await word5.trigger('click')
  await word.trigger("click", { shiftKey: true });

  expect(word5.classes()).toContain('active-from')
  expect(word.classes()).toContain('active-to')
  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(1);
})

test('cannot create a link to a word with nested tokens', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const from = wrapper.find('[data-testid=word-1]')
  const to = wrapper.find('[data-testid=word-5]')
  await from.trigger('click')
  await to.trigger("click", { shiftKey: true });

  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(0);
})

test('can create a link from a nested token within a word', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const from = wrapper.find('[data-testid=token-5]')
  const to = wrapper.find('[data-testid=word-3]')
  await from.trigger('click')
  await to.trigger("click", { shiftKey: true });

  expect(from.classes()).toContain('active-from-token')
  expect(to.classes()).toContain('active-to')
  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(1);
})

test('can create a link to a nested token within a word', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const from = wrapper.find('[data-testid=word-3]')
  const to = wrapper.find('[data-testid=token-5]')
  await from.trigger('click')
  await to.trigger("click", { shiftKey: true });

  expect(from.classes()).toContain('active-from')
  expect(to.classes()).toContain('active-to-token')

  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(1);
})

test('can create a link nested tokens within same word', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const from = wrapper.find('[data-testid=token-6]')
  const to = wrapper.find('[data-testid=token-5]')
  await from.trigger('click')
  await to.trigger("click", { shiftKey: true });

  expect(from.classes()).toContain('active-from-token')
  expect(to.classes()).toContain('active-to-token')

  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(1);
})

test('cannot create a link from a word to its nested token', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const from = wrapper.find('[data-testid=word-5]')
  const to = wrapper.find('[data-testid=token-5]')
  await from.trigger('click')
  await to.trigger("click", { shiftKey: true });

  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(0);
})

test('cannot create a link to a word within the phrase being linked from', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const from1 = wrapper.find('[data-testid=word-1]')
  const from2 = wrapper.find('[data-testid=word-3]')
  const to = wrapper.find('[data-testid=word-2]')
  await from1.trigger('click')
  await from2.trigger('click')
  await to.trigger("click", { shiftKey: true });

  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(0);
})

test('clicking on a compound token then the word should select the whole thing', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });

  const word = wrapper.find('[data-testid=word-5]')
  const token1 = wrapper.find('[data-testid=token-5]')
  const token2 = wrapper.find('[data-testid=token-6]')

  await token2.trigger('click')
  await word.trigger('click')

  expect(word.classes()).toContain('selected')
  expect(token1.classes()).toContain('selected')
  expect(token2.classes()).toContain('selected')
})

test('selecting a connection should show the delete button', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });


  const word = wrapper.find('[data-testid=word-1]')
  const word2 = wrapper.find('[data-testid=word-2]')
  await word.trigger('click')
  await word2.trigger("click", { shiftKey: true });

  expect(wrapper.findAll('[data-testid=delete]').length).toBe(1);
})

test('should not show delete button when a connection is not selected', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });


  const word = wrapper.find('[data-testid=word-1]')
  const word2 = wrapper.find('[data-testid=word-2]')
  await word.trigger('click')
  await word2.trigger("click", { shiftKey: true });
  await word.trigger('click')

  expect(wrapper.findAll('[data-testid=delete]').length).toBe(0);
})

test('clicking on delete button should delete the connection', async () => {
  const wrapper = mkWrapper({
    store: {
      state: {
        ...seedFromGraph
      }
    }
  });


  const word = wrapper.find('[data-testid=word-1]')
  const word2 = wrapper.find('[data-testid=word-2]')
  const word3 = wrapper.find('[data-testid=word-3]')
  await word.trigger('click')
  await word2.trigger("click", { shiftKey: true });
  await word3.trigger('click')
  await word2.trigger("click", { shiftKey: true });

  await wrapper.find('[data-testid=delete]').trigger('click')

  const connections = getSelectableConnections(wrapper);
  expect(connections.length).toBe(1);
  expect(wrapper.findAll('[data-testid=delete]').length).toBe(0);
})