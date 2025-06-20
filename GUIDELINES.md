# Testing Guidelines for Cami Applications

This guide shows you how to set up and run comprehensive tests for your Cami applications using Vitest + JSDOM, following the patterns established in production codebases.

## Table of Contents

- [Project Structure](#project-structure)
- [Test Setup](#test-setup)
- [Testing Patterns](#testing-patterns)
- [Store Testing](#store-testing)
- [Component Testing](#component-testing)
- [Action Testing](#action-testing)
- [Integration Testing](#integration-testing)
- [Best Practices](#best-practices)

## Project Structure

For large Cami applications, follow this recommended structure where stores, actions, and components are defined in separate modules:

```
src/
├── stores.ts                 # Main store definitions
├── urlStore.ts              # URL-based routing store
├── index.ts                 # Main app entry point
├── actions/
│   ├── documents/
│   │   ├── index.ts
│   │   ├── coreActions.ts
│   │   ├── editorActions.ts
│   │   └── aiStreamActions.ts
│   ├── threads/
│   │   ├── index.ts
│   │   ├── messageActions.ts
│   │   └── conversationActions.ts
│   └── aiEditor/
│       └── index.ts
├── elements/
│   ├── app.ts               # Main app component
│   ├── documents/
│   ├── threads/
│   └── aiEditor/
├── stores/
│   └── aiEditorFileStore.ts
├── types/
│   └── index.ts
└── utils/
    └── index.ts
```

### Example Production Files

**src/stores.ts** - Define your main stores:
```javascript
import { store } from 'cami';

export const documentStore = store({
  state: {
    documents: [],
    currentDocument: null,
    loading: false,
    error: null
  },
  
  actions: {
    loadDocument: async ({ state }, documentId) => {
      state.loading = true;
      // Implementation here
    },
    updateDocument: ({ state }, { id, changes }) => {
      // Implementation here
    }
  }
});

export const editorStore = store({
  state: {
    editorState: 'idle',
    document: null,
    saving: false
  }
});

// Define state machines
editorStore.defineMachine('editor', {
  startEditing: {
    from: [{ editorState: 'idle' }],
    to: { editorState: 'editing' }
  }
  // More transitions...
});
```

**src/elements/app.ts** - Main app component:
```javascript
import { documentStore, editorStore } from '../stores.js';
import { DocumentSidebar } from './documentSidebar.js';

export function App({ container }) {
  // Your main app initialization
  DocumentSidebar({ container, store: documentStore });
  // More component initialization...
}
```

tests/
├── vitest.config.js
├── vitest.setup.js
├── spec/
│   ├── stores/
│   │   ├── StoreSpec.js
│   │   ├── UrlStoreSpec.js
│   │   └── AiEditorFileStoreSpec.js
│   ├── actions/
│   │   ├── DocumentActionsSpec.js
│   │   ├── ThreadActionsSpec.js
│   │   └── AiEditorActionsSpec.js
│   ├── elements/
│   │   ├── AppSpec.js
│   │   ├── DocumentsSpec.js
│   │   └── ThreadsSpec.js
│   └── integration/
│       ├── DocumentWorkflowSpec.js
│       └── ChatWorkflowSpec.js
└── fixtures/
    ├── mockData.js
    └── testHelpers.js
```

## Test Setup

### 1. Install Dependencies

```bash
npm install --save-dev vitest jsdom @vitest/ui fake-indexeddb
```

### 2. Configure Vitest (`vitest.config.js`)

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.js'],
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
      ]
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
```

### 3. Setup File (`vitest.setup.js`)

```javascript
import { beforeEach, afterEach } from 'vitest';
import 'fake-indexeddb/auto';

// Import your Cami build
import '../src/index.js';

// Make Cami globally available
global.cami = window.cami;

// Clean up DOM and stores between tests
beforeEach(() => {
  document.head.innerHTML = '';
  document.body.innerHTML = '';
  
  // Reset any global stores if needed
  if (window.cami && window.cami.stores) {
    Object.values(window.cami.stores).forEach(store => {
      if (store.reset) store.reset();
    });
  }
});

afterEach(() => {
  // Clean up any event listeners or timers
  window.localStorage.clear();
  window.sessionStorage.clear();
});
```

### 4. Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Testing Patterns

### Store Testing

Test your main stores by importing the actual production stores:

```javascript
// tests/spec/stores/DocumentStoreSpec.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { documentStore } from '../../../src/stores.js';

describe('Document Store', () => {
  beforeEach(() => {
    // Reset store to initial state
    documentStore.setState({
      documents: [],
      currentDocument: null,
      loading: false,
      error: null
    });
    
    // Clear any mocks
    vi.clearAllMocks();
  });

  describe('Document Loading', () => {
    it('should load a document successfully', async () => {
      const mockDocument = { id: 1, title: 'Test Doc', content: 'Content' };
      
      // Mock your API call
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDocument)
      });

      await documentStore.dispatch('loadDocument', 1);

      expect(documentStore.getState().currentDocument).toEqual(mockDocument);
      expect(documentStore.getState().loading).toBe(false);
    });

    it('should handle loading errors', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      await documentStore.dispatch('loadDocument', 1);

      expect(documentStore.getState().error).toBe('Network error');
      expect(documentStore.getState().loading).toBe(false);
    });
  });

  describe('Document Updates', () => {
    it('should update document properties', () => {
      // Set up initial state
      documentStore.setState({
        documents: [{ id: 1, title: 'Old Title', content: 'Content' }]
      });
      
      documentStore.dispatch('updateDocument', { 
        id: 1, 
        changes: { title: 'New Title' } 
      });

      const updatedDoc = documentStore.getState().documents.find(d => d.id === 1);
      expect(updatedDoc.title).toBe('New Title');
    });
  });
});
```

### Component Testing

Test your reactive elements by importing the actual production components:

```javascript
// tests/spec/elements/DocumentSidebarSpec.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { documentStore } from '../../../src/stores.js';
import { DocumentSidebar } from '../../../src/elements/documentSidebar.js';

describe('Document Sidebar Component', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'app';
    document.body.appendChild(container);

    // Reset store to test state
    documentStore.setState({
      documents: [
        { id: 1, title: 'Doc 1', type: 'markdown' },
        { id: 2, title: 'Doc 2', type: 'text' }
      ],
      selectedDocumentId: null
    });

    // Initialize the actual production component
    DocumentSidebar({ 
      container, 
      store: documentStore 
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  it('should render document list', () => {
    const documentList = container.querySelector('[data-bind="documents"]');
    const documentItems = documentList.querySelectorAll('li');
    
    expect(documentItems).toHaveLength(2);
    expect(documentItems[0].textContent).toContain('Doc 1');
    expect(documentItems[1].textContent).toContain('Doc 2');
  });

  it('should select document on click', () => {
    const firstDocumentItem = container.querySelector('[data-document-id="1"]');
    
    firstDocumentItem.click();
    
    expect(documentStore.getState().selectedDocumentId).toBe(1);
  });

  it('should update when store changes', () => {
    documentStore.dispatch('addDocument', { 
      id: 3, 
      title: 'New Doc', 
      type: 'markdown' 
    });

    // Wait for reactive update
    setTimeout(() => {
      const documentItems = container.querySelectorAll('[data-document-id]');
      expect(documentItems).toHaveLength(3);
    }, 0);
  });
});
```

### Action Testing

Test your action modules by importing the actual production stores and using dispatch:

```javascript
// tests/spec/actions/DocumentActionsSpec.js
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { documentStore } from '../../../src/stores.js';

describe('Document Actions', () => {
  let mockApiClient;

  beforeEach(() => {
    // Reset store to clean state
    documentStore.setState({
      documents: [],
      loading: false,
      error: null
    });

    // Mock external dependencies
    mockApiClient = {
      post: vi.fn(),
      get: vi.fn(),
      put: vi.fn(),
      delete: vi.fn()
    };
    
    vi.clearAllMocks();
  });

  describe('createDocument', () => {
    it('should create a new document', async () => {
      const newDoc = { title: 'New Document', content: '' };
      const createdDoc = { id: 1, ...newDoc, createdAt: new Date() };

      mockApiClient.post.mockResolvedValue({ data: createdDoc });

      await documentStore.dispatch('createDocument', newDoc);

      expect(mockApiClient.post).toHaveBeenCalledWith('/documents', newDoc);
      expect(documentStore.getState().documents).toContain(createdDoc);
    });

    it('should handle creation errors', async () => {
      mockApiClient.post.mockRejectedValue(new Error('Server error'));

      await documentStore.dispatch('createDocument', { title: 'Test' });

      expect(documentStore.getState().error).toBe('Server error');
    });
  });

  describe('deleteDocument', () => {
    beforeEach(() => {
      documentStore.setState({
        documents: [
          { id: 1, title: 'Doc 1' },
          { id: 2, title: 'Doc 2' }
        ]
      });
    });

    it('should delete a document', async () => {
      mockApiClient.delete.mockResolvedValue({ success: true });

      await documentStore.dispatch('deleteDocument', 1);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/documents/1');
      expect(documentStore.getState().documents).toHaveLength(1);
      expect(documentStore.getState().documents[0].id).toBe(2);
    });
  });
});
```

### State Machine Testing

Test complex workflows with state machines by importing your actual production stores:

```javascript
// tests/spec/StateMachineSpec.js
import { describe, it, expect, beforeEach } from 'vitest';
import { editorStore } from '../../../src/stores.js';

describe('Document Editor State Machine', () => {
  beforeEach(() => {
    // Reset store to initial state
    editorStore.setState({
      editorState: 'idle',
      document: null,
      saving: false
    });
  });

  it('should transition from idle to editing', () => {
    const document = { id: 1, title: 'Test Doc' };
    
    editorStore.dispatch('editor:startEditing', { document });
    
    expect(editorStore.getState().editorState).toBe('editing');
    expect(editorStore.getState().document).toEqual(document);
  });

  it('should handle save workflow', () => {
    editorStore.setState({ editorState: 'editing' });
    
    editorStore.dispatch('editor:saveDocument');
    expect(editorStore.getState().editorState).toBe('saving');
    expect(editorStore.getState().saving).toBe(true);
    
    editorStore.dispatch('editor:saveComplete');
    expect(editorStore.getState().editorState).toBe('idle');
    expect(editorStore.getState().saving).toBe(false);
  });

  it('should reject invalid transitions', () => {
    // Try to save from idle state (should be ignored)
    editorStore.dispatch('editor:saveDocument');
    
    expect(editorStore.getState().editorState).toBe('idle');
  });
});
```

## Integration Testing

Test complete user workflows by importing your main app component:

```javascript
// tests/spec/integration/DocumentWorkflowSpec.js
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { App } from '../../../src/elements/app.js';
import { documentStore } from '../../../src/stores.js';

describe('Document Management Workflow', () => {
  let appContainer;

  beforeEach(() => {
    appContainer = document.createElement('div');
    appContainer.id = 'app';
    document.body.appendChild(appContainer);
    
    // Reset stores to clean state
    documentStore.setState({
      documents: [],
      currentDocument: null,
      loading: false,
      error: null
    });
    
    // Initialize your main app component
    App({ container: appContainer });
  });

  afterEach(() => {
    document.body.removeChild(appContainer);
  });

  it('should complete full document creation workflow', async () => {
    // 1. Click "New Document" button
    const newDocButton = appContainer.querySelector('[data-action="new-document"]');
    newDocButton.click();

    // 2. Fill in document form
    const titleInput = appContainer.querySelector('[data-field="title"]');
    const contentArea = appContainer.querySelector('[data-field="content"]');
    
    titleInput.value = 'Integration Test Document';
    contentArea.value = 'This is test content';
    
    // Trigger input events
    titleInput.dispatchEvent(new Event('input'));
    contentArea.dispatchEvent(new Event('input'));

    // 3. Save document
    const saveButton = appContainer.querySelector('[data-action="save-document"]');
    saveButton.click();

    // 4. Verify document appears in list
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for async operations
    
    const documentList = appContainer.querySelector('[data-element="document-list"]');
    const documentItems = documentList.querySelectorAll('[data-document-title]');
    
    const newDocItem = Array.from(documentItems).find(
      item => item.textContent.includes('Integration Test Document')
    );
    
    expect(newDocItem).toBeTruthy();
  });

  it('should handle document editing workflow', async () => {
    // Assumes a document already exists
    const documentItem = appContainer.querySelector('[data-document-id="1"]');
    documentItem.click();

    // Enter edit mode
    const editButton = appContainer.querySelector('[data-action="edit-document"]');
    editButton.click();

    // Modify content
    const contentArea = appContainer.querySelector('[data-field="content"]');
    contentArea.value = 'Updated content';
    contentArea.dispatchEvent(new Event('input'));

    // Save changes
    const saveButton = appContainer.querySelector('[data-action="save-document"]');
    saveButton.click();

    // Verify changes persisted
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(contentArea.value).toBe('Updated content');
  });
});
```

## Best Practices

### 1. Test Organization

- **Unit Tests**: Test individual functions and small components
- **Integration Tests**: Test component interactions and workflows  
- **End-to-End Tests**: Test complete user journeys

### 2. Mock External Dependencies

```javascript
// Mock API calls
global.fetch = vi.fn();

// Mock localStorage/sessionStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
});
```

### 3. Test Data Management

Create reusable test fixtures:

```javascript
// tests/fixtures/mockData.js
export const mockDocuments = [
  { id: 1, title: 'Test Doc 1', content: 'Content 1' },
  { id: 2, title: 'Test Doc 2', content: 'Content 2' }
];

export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com'
};
```

### 4. Async Testing

Handle promises and async operations properly:

```javascript
it('should handle async operations', async () => {
  const promise = store.dispatch('asyncAction');
  
  // Test loading state
  expect(store.getState().loading).toBe(true);
  
  await promise;
  
  // Test completed state
  expect(store.getState().loading).toBe(false);
});
```

### 5. Error Boundary Testing

Test error handling scenarios:

```javascript
it('should handle errors gracefully', async () => {
  global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
  
  await store.dispatch('fetchData');
  
  expect(store.getState().error).toBe('Network error');
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui

# Run specific test file
npm test -- DocumentStoreSpec.js

# Run tests matching pattern
npm test -- --grep "should load document"
```

## Debugging Tests

### 1. Use Console Logging

```javascript
it('should debug state changes', () => {
  console.log('Initial state:', store.getState());
  
  store.dispatch('updateData', newData);
  
  console.log('Final state:', store.getState());
});
```

### 2. Use Vitest UI

The Vitest UI provides an excellent debugging experience:

```bash
npm run test:ui
```

### 3. Test Individual Components

```javascript
// Isolate component testing
const { mount } = await import('./testUtils.js');

const component = mount(MyComponent, { 
  props: { data: mockData },
  store: mockStore 
});
```

This comprehensive testing setup ensures your Cami applications are robust, maintainable, and reliable. Follow these patterns to build confidence in your code and catch issues early in development.