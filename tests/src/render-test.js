const { html, ReactiveElement, store } = cami

// Create a test element for render optimization tests
class RenderTestElement extends ReactiveElement {
  count = 0
  items = [1, 2, 3]
  complex = { nested: { value: 'test' } }

  // Track render calls
  renders = 0

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
  }

  template() {
    return html`
            <div>
                <p>Count: ${this.count}</p>
                <ul>
                    ${this.items.map(i => html`<li>${i}</li>`)}
                </ul>
                <p>Nested: ${this.complex.nested.value}</p>
            </div>
        `
  }

  render() {
    this.renders++
    super.render()
  }

  getRenderCount() {
    return this.renders
  }

  resetRenderCount() {
    this.renders = 0
  }
}

customElements.define('render-test-element', RenderTestElement)

// Create stores for testing
const createTestStore = () => {
  const renderStore = store({
    state: {
      simple: 'value',
      complex: {
        nested: {
          value: 42,
          array: [1, 2, 3],
        },
      },
      items: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
    },
    name: `render-test-store-${Date.now()}`,
  })

  renderStore.defineAction('updateSimple', ({ state, payload }) => {
    state.simple = payload
  })

  renderStore.defineAction('updateNested', ({ state, payload }) => {
    state.complex.nested.value = payload
  })

  renderStore.defineAction('updateArray', ({ state, payload }) => {
    state.complex.nested.array = payload
  })

  renderStore.defineAction('updateItem', ({ state, payload }) => {
    const { id, ...changes } = payload
    const index = state.items.findIndex(item => item.id === id)
    if (index !== -1) {
      Object.assign(state.items[index], changes)
    }
  })

  renderStore.defineAction('replaceItem', ({ state, payload }) => {
    const { id, ...newItem } = payload
    const index = state.items.findIndex(item => item.id === id)
    if (index !== -1) {
      state.items[index] = { id, ...newItem }
    }
  })

  return renderStore
}

// Create complex content block store for testing
const createComplexStore = () => {
  const complexStore = store({
    state: {
      content: {
        blocks: [
          {
            id: 'block1',
            type: 'text',
            data: {
              text: 'Hello world',
              style: { color: 'black', fontSize: 16 },
            },
            children: [
              {
                id: 'child1',
                type: 'span',
                data: { text: 'Child text' },
              },
            ],
          },
          {
            id: 'block2',
            type: 'image',
            data: {
              src: 'test.jpg',
              alt: 'Test image',
              size: { width: 100, height: 100 },
            },
          },
        ],
      },
      metadata: {
        author: 'Test Author',
        created: '2025-03-20',
      },
    },
    name: `complex-render-test-${Date.now()}`,
  })

  complexStore.defineAction('updateBlock', ({ state, payload }) => {
    const { id, data } = payload
    const block = state.content.blocks.find(block => block.id === id)
    if (block) {
      Object.assign(block.data, data)
    }
  })

  complexStore.defineAction('updateChildBlock', ({ state, payload }) => {
    const { parentId, childId, data } = payload
    const block = state.content.blocks.find(block => block.id === parentId)
    if (block && block.children) {
      const child = block.children.find(child => child.id === childId)
      if (child) {
        Object.assign(child.data, data)
      }
    }
  })

  complexStore.defineAction('replaceBlocks', ({ state, payload }) => {
    state.content.blocks = payload
  })

  return complexStore
}
