# TypeScript Migration Plan for cami.js

## Executive Summary

This document outlines an incremental migration strategy to convert cami.js from JavaScript to TypeScript with the strictest settings. The plan is designed to maintain a working, buildable codebase at each step while progressively adding type safety.

## Current State Analysis

### Project Overview
- **Core Purpose**: Reactive state management library with web components support
- **Build System**: esbuild (supports TypeScript out of the box)
- **Module System**: ESM with IIFE build for CDN
- **Current Type Checking**: JSDoc annotations with `tsc --checkJs`
- **Dependencies**: Most have built-in types (immer, idb, fast-deep-equal)

### Core Architecture
1. **Observable System**: Base reactive primitive with subscriber pattern
2. **State Management**: ObservableState, ObservableStore with immer integration
3. **Web Components**: ReactiveElement extending HTMLElement
4. **Templating**: lit-html integration
5. **Type System**: Runtime type validation system (Type.js)
6. **Storage**: Adapters for localStorage and IndexedDB
7. **Routing**: URL-based store for navigation

## Migration Strategy

### Phase 0: Preparation (1-2 days)
1. **Update tsconfig.json for strict TypeScript**
   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitThis": true,
       "alwaysStrict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "target": "ESNext",
       "module": "ESNext",
       "moduleResolution": "node",
       "lib": ["ESNext", "DOM", "DOM.Iterable"],
       "declaration": true,
       "declarationMap": true,
       "sourceMap": true,
       "outDir": "./build",
       "rootDir": "./src"
     },
     "include": ["src/**/*"],
     "exclude": ["node_modules", "build", "tests", "examples"]
   }
   ```

2. **Install missing type dependencies**
   ```bash
   npm install --save-dev @types/lodash
   npm install lit-html
   ```

3. **Create type declaration for rfdc**
   ```typescript
   // src/types/rfdc.d.ts
   declare module 'rfdc' {
     function rfdc(options?: { proto?: boolean; circles?: boolean }): <T>(obj: T) => T;
     export = rfdc;
   }
   ```

4. **Update build scripts** to handle TypeScript compilation

### Phase 1: Core Types & Utilities (2-3 days)
Start with leaf modules that have no internal dependencies:

1. **config.ts**
   - Simple configuration object
   - Export interface for config shape
   
2. **trace.ts**
   - Logging utility
   - Simple function signatures

3. **types/index.ts** (rename from types.js)
   - Convert runtime type system to TypeScript types
   - Create type guards and validators
   - Map Type constructors to TypeScript types

**Deliverable**: Working type system with full TypeScript types

### Phase 2: Observable Foundation (3-4 days)
Convert the core reactive primitives:

1. **observables/observable.ts**
   ```typescript
   interface Observer<T> {
     next(value: T): void;
     error?(error: any): void;
     complete?(): void;
   }
   
   class Observable<T> {
     constructor(subscriber: (observer: Observer<T>) => (() => void) | void);
     subscribe(observer: Observer<T> | ((value: T) => void)): () => void;
   }
   ```

2. **observables/observable-state.ts**
   - Generic `ObservableState<T>`
   - Dependency tracking types
   - Effect function types

**Deliverable**: Type-safe reactive primitives

### Phase 3: State Management (4-5 days)
Build on observable foundation:

1. **observables/observable-store.ts**
   ```typescript
   interface StoreConfig<TState, TActions> {
     state: TState;
     actions: ActionMap<TState, TActions>;
     queries?: QueryMap<TState>;
     mutations?: MutationMap<TState>;
   }
   
   class ObservableStore<TState, TActions> extends Observable<TState> {
     // ...
   }
   ```

2. **observables/observable-model.ts**
   - Schema-based model types
   - Validation integration

3. **observables/observable-proxy.ts**
   - Proxy handler types
   - Path tracking types

**Deliverable**: Fully typed state management

### Phase 4: Storage & Routing (2-3 days)

1. **storage/adapters.ts**
   - Storage interface types
   - Async storage operations

2. **observables/url-store.ts**
   - Route configuration types
   - Navigation state types

**Deliverable**: Type-safe persistence and routing

### Phase 5: Web Components (3-4 days)

1. **reactive-element.ts**
   - Custom element types
   - Property decorator types
   - Template types from lit-html

**Deliverable**: Type-safe web components

### Phase 6: Main Export & Integration (2-3 days)

1. **cami.ts**
   - Re-export all typed modules
   - Ensure proper type exports

2. **Create index.d.ts**
   - Generated declaration file
   - Public API types

**Deliverable**: Complete TypeScript library

## Implementation Guidelines

### For Each Module Conversion:

1. **Rename .js to .ts**
2. **Convert JSDoc to TypeScript**
   ```javascript
   // Before
   /**
    * @param {string} name
    * @returns {number}
    */
   function foo(name) { ... }
   
   // After
   function foo(name: string): number { ... }
   ```

3. **Add explicit types to all parameters and returns**
4. **Handle null/undefined with strict null checks**
5. **Run type checker and fix errors**
6. **Update imports/exports**
7. **Test that builds still work**

### Type Design Principles:

1. **Use generics for reusability**
   ```typescript
   class Observable<T> { ... }
   class ObservableState<T> extends Observable<T> { ... }
   ```

2. **Create discriminated unions for actions**
   ```typescript
   type Action = 
     | { type: 'INCREMENT'; payload: number }
     | { type: 'DECREMENT'; payload: number }
     | { type: 'RESET' };
   ```

3. **Use interface segregation**
   ```typescript
   interface Subscribable<T> {
     subscribe(observer: Observer<T>): () => void;
   }
   
   interface StateContainer<T> {
     get(): T;
     set(value: T): void;
   }
   ```

4. **Leverage type inference where possible**
5. **Export types alongside implementations**

### Testing Strategy:

1. **Type tests using `tsd` or similar**
2. **Ensure examples still compile**
3. **Verify declaration files are generated**
4. **Check that all public APIs are typed**

## Success Criteria

1. **All files converted to TypeScript**
2. **Strict mode enabled with no errors**
3. **Declaration files generated**
4. **All examples working**
5. **Build sizes comparable to JavaScript version**
6. **Type coverage 100%**

## Estimated Timeline

- **Total Duration**: 3-4 weeks
- **Phase 0-1**: Week 1
- **Phase 2-3**: Week 2
- **Phase 4-5**: Week 3
- **Phase 6 + Testing**: Week 4

## Next Steps

1. Create a new branch `typescript-migration`
2. Start with Phase 0 preparation
3. Proceed through phases incrementally
4. Create PRs for each phase
5. Update documentation with TypeScript examples

## Notes

- Each phase produces a working, buildable codebase
- Users can start using TypeScript features incrementally
- The runtime type system (Type.js) can coexist with TypeScript initially
- Consider publishing both JavaScript and TypeScript versions during transition