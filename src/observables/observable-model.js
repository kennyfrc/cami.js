import { store } from './observable-store.js';

export function model(config) {
  const {
    name,
    state,
    actions = {},
    asyncActions = {},
    machines = {},
    queries = {},
    mutations = {},
    specs = {},
    memos = {},
    options = {}
  } = config;

  if (!name) {
    throw new Error('A name must be provided for the model');
  }

  const modelStore = store({ state, name, ...options });

  // Define actions
  Object.entries(actions).forEach(([actionName, actionFn]) => {
    modelStore.defineAction(`${name}/${actionName}`, actionFn);
  });

  // Define async actions (thunks)
  Object.entries(asyncActions).forEach(([thunkName, thunkFn]) => {
    modelStore.defineAsyncAction(`${name}/${thunkName}`, thunkFn);
  });

  // Define state machines
  Object.entries(machines).forEach(([machineName, machineDefinition]) => {
    modelStore.defineMachine(`${name}/${machineName}`, machineDefinition);
  });

  // Define queries
  Object.entries(queries).forEach(([queryName, queryConfig]) => {
    modelStore.defineQuery(`${name}/${queryName}`, queryConfig);
  });

  // Define mutations
  Object.entries(mutations).forEach(([mutationName, mutationConfig]) => {
    modelStore.defineMutation(`${name}/${mutationName}`, mutationConfig);
  });

  // Define specs
  Object.entries(specs).forEach(([actionName, spec]) => {
    modelStore.defineSpec(`${name}/${actionName}`, spec);
  });

  // Define memos
  Object.entries(memos).forEach(([memoName, memoFn]) => {
    modelStore.defineMemo(`${name}/${memoName}`, memoFn);
  });

  return modelStore;
}
