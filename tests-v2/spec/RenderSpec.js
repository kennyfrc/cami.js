import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Import from cami
const { store, ObservableState, ReactiveElement, html } = cami;

describe("Render Optimization Tests", function () {
  describe("ObservableStore rendering optimizations", function () {
    let testStore;
    let testElement;
    let renderCount;

    // Create store function defined in the local scope
    const createTestStore = () => {
      const renderStore = store({
        state: {
          simple: "value",
          complex: {
            nested: {
              value: 42,
              array: [1, 2, 3]
            }
          },
          items: [
            { id: 1, name: "Item 1" },
            { id: 2, name: "Item 2" }
          ]
        },
        name: `render-test-store-${Date.now()}`
      });

      renderStore.defineAction("updateSimple", ({ state, payload }) => {
        state.simple = payload;
      });

      renderStore.defineAction("updateNested", ({ state, payload }) => {
        state.complex.nested.value = payload;
      });

      renderStore.defineAction("updateArray", ({ state, payload }) => {
        state.complex.nested.array = payload;
      });

      renderStore.defineAction("updateItem", ({ state, payload }) => {
        const { id, ...changes } = payload;
        const index = state.items.findIndex(item => item.id === id);
        if (index !== -1) {
          Object.assign(state.items[index], changes);
        }
      });

      renderStore.defineAction("replaceItem", ({ state, payload }) => {
        const { id, ...newItem } = payload;
        const index = state.items.findIndex(item => item.id === id);
        if (index !== -1) {
          state.items[index] = { id, ...newItem };
        }
      });
      
      return renderStore;
    };
    
    // Create a test element for store tests
    class StoreTestElement extends ReactiveElement {
      storeState = {};
      renders = 0;
      
      constructor() {
        super();
      }
      
      connectedCallback() {
        super.connectedCallback();
      }
      
      template() {
        const storeState = testStore.getState();
        return html`<div>${JSON.stringify(storeState)}</div>`;
      }
      
      render() {
        this.renders++;
        super.render();
      }
      
      getRenderCount() {
        return this.renders;
      }
      
      resetRenderCount() {
        this.renders = 0;
      }
    }
    
    // Define custom element if not already defined
    if (!customElements.get('store-test-element')) {
      customElements.define('store-test-element', StoreTestElement);
    }

    beforeEach(async function () {
      renderCount = 0;
      testStore = createTestStore();
      
      // Create test element and connect to store
      testElement = document.createElement('store-test-element');
      testElement.store = testStore;
      document.body.appendChild(testElement);
      await window.customElements.whenDefined('store-test-element');
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 50));
      testElement.resetRenderCount();
      renderCount = 0;
    });

    afterEach(function() {
      if (testElement && testElement.parentNode) {
        testElement.parentNode.removeChild(testElement);
      }
    });
    
    it("should not render when setting the same primitive value", function () {
      // First dispatch should be a no-op
      testStore.dispatch("updateSimple", "value");
      expect(testElement.getRenderCount()).toBe(0);
      
      // Reset the render count
      testElement.resetRenderCount();
      
      // Second dispatch changes the value
      testStore.dispatch("updateSimple", "new value");
      expect(testElement.getRenderCount()).toBe(2);
      
      // Third dispatch with same value should be a no-op
      testStore.dispatch("updateSimple", "new value");
      expect(testElement.getRenderCount()).toBe(2);
    });

    it("should not render when setting the same nested value", function () {
      // First dispatch should be a no-op
      testStore.dispatch("updateNested", 42);
      expect(testElement.getRenderCount()).toBe(0);
      
      // Reset the render count
      testElement.resetRenderCount();
      
      // Second dispatch changes the value
      testStore.dispatch("updateNested", 43);
      expect(testElement.getRenderCount()).toBe(2);
      
      // Third dispatch with same value should be a no-op
      testStore.dispatch("updateNested", 43);
      expect(testElement.getRenderCount()).toBe(2);
    });

    it("should not render when setting the same array contents", function () {
      // First dispatch should be a no-op
      const initialArray = [1, 2, 3];
      testStore.dispatch("updateArray", initialArray);
      expect(testElement.getRenderCount()).toBe(0);
      
      // Reset the render count
      testElement.resetRenderCount();
      
      // Different array with same values should not trigger render
      const sameArray = [1, 2, 3];
      testStore.dispatch("updateArray", sameArray);
      expect(testElement.getRenderCount()).toBe(0);
      
      // Reset the render count
      testElement.resetRenderCount();
      
      // Different array with different values should trigger render
      const differentArray = [1, 2, 3, 4];
      testStore.dispatch("updateArray", differentArray);
      expect(testElement.getRenderCount()).toBe(2);
    });

    it("should not render when updating an object with the same values", function () {
      // First update with same values should be a no-op
      testStore.dispatch("updateItem", { id: 1, name: "Item 1" });
      expect(testElement.getRenderCount()).toBe(0);
      
      // Reset the render count
      testElement.resetRenderCount();
      
      // Update with different value should trigger render
      testStore.dispatch("updateItem", { id: 1, name: "Updated Item 1" });
      expect(testElement.getRenderCount()).toBe(2);
      
      // Update with same value again should be a no-op
      testStore.dispatch("updateItem", { id: 1, name: "Updated Item 1" });
      expect(testElement.getRenderCount()).toBe(2);
    });

    it("should not render when replacing an object with deep-equal object", function () {
      // First replace with same values should be a no-op
      testStore.dispatch("replaceItem", { id: 1, name: "Item 1" });
      expect(testElement.getRenderCount()).toBe(0);
      
      // Reset the render count
      testElement.resetRenderCount();
      
      // Replace with different values should trigger render
      testStore.dispatch("replaceItem", { id: 1, name: "New Name" });
      expect(testElement.getRenderCount()).toBe(2);
      
      // Replace with same values again should be a no-op
      testStore.dispatch("replaceItem", { id: 1, name: "New Name" });
      expect(testElement.getRenderCount()).toBe(2);
    });
  });

  describe("ReactiveElement rendering optimizations", function () {
    // Create a test element for render optimization tests
    class RenderTestElement extends ReactiveElement {
      count = 0;
      items = [1, 2, 3];
      complex = { nested: { value: 'test' } };

      // Track render calls
      renders = 0;

      constructor() {
        super();
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
        `;
      }
      
      render() {
        this.renders++;
        super.render();
      }
      
      getRenderCount() {
        return this.renders;
      }
      
      resetRenderCount() {
        this.renders = 0;
      }
    }

    // Define custom element if not already defined
    if (!customElements.get('render-test-element')) {
      customElements.define('render-test-element', RenderTestElement);
    }

    let element;

    beforeEach(async function () {
      // Create test element
      element = document.createElement('render-test-element');
      document.body.appendChild(element);
      await window.customElements.whenDefined('render-test-element');
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 50));
      element.resetRenderCount();
    });
    
    afterEach(function() {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });

    it("should not re-render when update doesn't change template output", function() {
      // Update with the same value should not trigger render
      element.count = 0;
      expect(element.getRenderCount()).toBe(0);
      
      // Update with different value should trigger render
      element.count = 1;
      expect(element.getRenderCount()).toBe(1);
      
      // Update with same value again should not trigger render
      element.count = 1;
      expect(element.getRenderCount()).toBe(1);
    });
    
    it("should not re-render when nested state doesn't change", function() {
      // Update with same nested object should not trigger render
      element.complex = { nested: { value: 'test' } };
      expect(element.getRenderCount()).toBe(0);
      
      // Update with different nested object should trigger render
      element.complex = { nested: { value: 'changed' } };
      expect(element.getRenderCount()).toBe(1);
    });
    
    it("should not re-render when array contents are the same", function() {
      // Update with same array should not trigger render
      element.items = [1, 2, 3];
      expect(element.getRenderCount()).toBe(0);
      
      // Update with different array should trigger render
      element.items = [1, 2, 3, 4];
      expect(element.getRenderCount()).toBe(1);
    });
  });

  // Test for deeply nested complex objects causing unnecessary renders
  describe("ObservableStore Complex nested object rendering optimizations", function() {
    let testStore;
    let testElement;
    
    // Create complex store function defined in the local scope
    const createComplexStore = () => {
      const complexStore = store({
        state: {
          content: {
            blocks: [
              {
                id: "block1",
                type: "text",
                data: {
                  text: "Hello world",
                  style: { color: "black", fontSize: 16 }
                },
                children: [
                  {
                    id: "child1",
                    type: "span",
                    data: { text: "Child text" }
                  }
                ]
              },
              {
                id: "block2",
                type: "image",
                data: {
                  src: "test.jpg",
                  alt: "Test image",
                  size: { width: 100, height: 100 }
                }
              }
            ]
          },
          metadata: {
            author: "Test Author",
            created: "2025-03-20"
          }
        },
        name: `complex-render-test-${Date.now()}`
      });
      
      complexStore.defineAction("updateBlock", ({ state, payload }) => {
        const { id, data } = payload;
        const blockIndex = state.content.blocks.findIndex(block => block.id === id);
        if (blockIndex !== -1) {
          // Create a new block with updated data
          const updatedBlock = {
            ...state.content.blocks[blockIndex],
            data: {
              ...state.content.blocks[blockIndex].data,
              ...data
            }
          };
          
          // Replace the block in the array
          state.content.blocks = [
            ...state.content.blocks.slice(0, blockIndex),
            updatedBlock,
            ...state.content.blocks.slice(blockIndex + 1)
          ];
        }
      });
      
      complexStore.defineAction("updateChildBlock", ({ state, payload }) => {
        const { parentId, childId, data } = payload;
        const blockIndex = state.content.blocks.findIndex(block => block.id === parentId);
        
        if (blockIndex !== -1 && state.content.blocks[blockIndex].children) {
          const block = state.content.blocks[blockIndex];
          const childIndex = block.children.findIndex(child => child.id === childId);
          
          if (childIndex !== -1) {
            // Create a new child with updated data
            const updatedChild = {
              ...block.children[childIndex],
              data: {
                ...block.children[childIndex].data,
                ...data
              }
            };
            
            // Create new children array with updated child
            const updatedChildren = [
              ...block.children.slice(0, childIndex),
              updatedChild,
              ...block.children.slice(childIndex + 1)
            ];
            
            // Create a new block with updated children
            const updatedBlock = {
              ...block,
              children: updatedChildren
            };
            
            // Replace the block in the array
            state.content.blocks = [
              ...state.content.blocks.slice(0, blockIndex),
              updatedBlock,
              ...state.content.blocks.slice(blockIndex + 1)
            ];
          }
        }
      });
      
      complexStore.defineAction("replaceBlocks", ({ state, payload }) => {
        state.content.blocks = [...payload];
      });
      
      return complexStore;
    };
    
    // Create a test element for complex store tests
    class ComplexStoreTestElement extends ReactiveElement {
      storeState = {};
      renders = 0;
      
      constructor() {
        super();
      }
      
      connectedCallback() {
        super.connectedCallback();
      }
      
      template() {
        const storeState = testStore.getState();
        return html`<div>${JSON.stringify(storeState)}</div>`;
      }
      
      render() {
        this.renders++;
        super.render();
      }
      
      getRenderCount() {
        return this.renders;
      }
      
      resetRenderCount() {
        this.renders = 0;
      }
    }
    
    // Define custom element if not already defined
    if (!customElements.get('complex-store-test-element')) {
      customElements.define('complex-store-test-element', ComplexStoreTestElement);
    }
    
    beforeEach(async function() {
      testStore = createComplexStore();
      
      // Create test element
      testElement = document.createElement('complex-store-test-element');
      document.body.appendChild(testElement);
      await window.customElements.whenDefined('complex-store-test-element');
      
      // Wait for initial render
      await new Promise(resolve => setTimeout(resolve, 50));
      testElement.resetRenderCount();
    });
    
    afterEach(function() {
      if (testElement && testElement.parentNode) {
        testElement.parentNode.removeChild(testElement);
      }
    });
    
    // These tests verify ReactiveElement's deep equality optimization for rendering
    
    it("should not render when updating a block with the same data", function() {
      // Update with same data should be a no-op
      testStore.dispatch("updateBlock", { 
        id: "block1", 
        data: { text: "Hello world" } 
      });
      expect(testElement.getRenderCount()).toBe(0);
      
      // Reset the render count
      testElement.resetRenderCount();
      
      // Update with different data should trigger render
      testStore.dispatch("updateBlock", { 
        id: "block1", 
        data: { text: "Updated text" } 
      });
      expect(testElement.getRenderCount()).toBe(2);
      
      // Update with same data again should be a no-op
      testStore.dispatch("updateBlock", { 
        id: "block1", 
        data: { text: "Updated text" } 
      });
      expect(testElement.getRenderCount()).toBe(2);
    });
    
    it("should not render when updating deep nested child data with same values", function() {
      // Update with same nested data should be a no-op
      testStore.dispatch("updateChildBlock", {
        parentId: "block1",
        childId: "child1",
        data: { text: "Child text" }
      });
      expect(testElement.getRenderCount()).toBe(0);
      
      // Reset the render count
      testElement.resetRenderCount();
      
      // Update with different nested data should trigger render
      testStore.dispatch("updateChildBlock", {
        parentId: "block1",
        childId: "child1",
        data: { text: "Updated child text" }
      });
      expect(testElement.getRenderCount()).toBe(2);
      
      // Update with same value again should be a no-op
      testStore.dispatch("updateChildBlock", {
        parentId: "block1",
        childId: "child1",
        data: { text: "Updated child text" }
      });
      expect(testElement.getRenderCount()).toBe(2);
    });
    
    it("should not render when replacing blocks with deep-equal blocks", function() {
      // Create a new array with same content but different references
      const newBlocks = JSON.parse(JSON.stringify(testStore.getState().content.blocks));
      
      // Replacing with deep-equal blocks should be a no-op
      testStore.dispatch("replaceBlocks", newBlocks);
      expect(testElement.getRenderCount()).toBe(0);
      
      // Modify one property deep in the structure
      newBlocks[0].data.text = "Changed text";
      
      // Now it should trigger a render
      testStore.dispatch("replaceBlocks", newBlocks);
      expect(testElement.getRenderCount()).toBe(2);
      
      // Creating another deep copy with the same values should not trigger render
      const sameBlocks = JSON.parse(JSON.stringify(newBlocks));
      testStore.dispatch("replaceBlocks", sameBlocks);
      expect(testElement.getRenderCount()).toBe(2);
    });
  });
});