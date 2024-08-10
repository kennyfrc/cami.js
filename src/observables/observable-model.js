import { store } from './observable-store.js';
import { Type, validateType } from '../types.js';

/**
 * Represents a Model in the application.
 *
 * @example
 * const Department = Type.Model("Department", {
 *   id: Type.Integer,
 *   name: Type.String
 * });
 *
 * const Employee = Type.Model("Employee", {
 *   id: Type.Integer,
 *   name: Type.String,
 *   department: Type.Reference(Department)
 * });
 *
 * const RootStore = Type.Model("RootStore", {
 *   departments: Type.Array(Department),
 *   employees: Type.Array(Employee)
 * });
 *
 * const store = RootStore.create({
 *   state: {
 *     departments: [],
 *     employees: []
 *   },
 *   actions: {
 *     addDepartment: ({ state, payload }) => {
 *       state.departments.push(payload);
 *     },
 *     addEmployee: ({ state, payload }) => {
 *       state.employees.push(payload);
 *     }
 *   },
 * });
 *
 * await store.dispatch('addDepartment', { id: 1, name: 'HR' });
 * await store.dispatch('addEmployee', { id: 1, name: 'John Doe', department: 1 });
 */
class Model {
  constructor(name, properties) {
    this.name = name;
    this.schema = properties;
  }

  create(config) {
    const { state, actions = {}, asyncActions = {}, machines = {}, queries = {}, mutations = {}, specs = {}, memos = {}, options = {} } = config;

    this._validateState(state);

    const modelStore = store({
      state,
      name: this.name,
      schema: this.schema,
      ...options
    });

    Object.entries(actions).forEach(([actionName, actionFn]) => {
      modelStore.defineAction(actionName, (context) => {
        actionFn(context);
        this._validateState(context.state);
      });
    });

    Object.entries(asyncActions).forEach(([thunkName, thunkFn]) => {
      modelStore.defineAsyncAction(thunkName, async (context) => {
        await thunkFn(context);
        this._validateState(context.state);
      });
    });

    Object.entries(machines).forEach(([machineName, machineDefinition]) => {
      modelStore.defineMachine(machineName, machineDefinition);
    });

    Object.entries(queries).forEach(([queryName, queryConfig]) => {
      modelStore.defineQuery(queryName, {
        queryKey: queryConfig.queryKey,
        queryFn: queryConfig.queryFn,
        onFetch: queryConfig.onFetch,
        onError: queryConfig.onError,
        onSuccess: queryConfig.onSuccess,
        onSettled: queryConfig.onSettled
      });
    });

    Object.entries(mutations).forEach(([mutationName, mutationConfig]) => {
      modelStore.defineMutation(mutationName, {
        mutationFn: mutationConfig.mutationFn,
        onMutate: mutationConfig.onMutate,
        onSuccess: mutationConfig.onSuccess,
        onError: mutationConfig.onError,
        onSettled: mutationConfig.onSettled
      });
    });

    Object.entries(specs).forEach(([actionName, spec]) => {
      modelStore.defineSpec(actionName, spec);
    });

    Object.entries(memos).forEach(([memoName, memoFn]) => {
      modelStore.defineMemo(memoName, memoFn);
    });

    return modelStore;
  }

  _validateState(state) {
    Object.entries(this.schema).forEach(([key, type]) => {
      try {
        if (Array.isArray(state[key])) {
          state[key].forEach((item, index) => {
            this._validateItem(item, type.itemType, [key, index], state);
          });
        } else {
          this._validateItem(state[key], type, [key], state);
        }
      } catch (error) {
        throw new Error(`Validation error in ${this.name}: ${error.message}`);
      }
    });
  }

  _validateItem(value, type, path, rootState) {
    if (type.type === 'reference') {
      if (typeof value !== 'number') {
        throw new Error(`Expected reference ID (number), got ${typeof value} at ${path.join('.')}`);
      }
    } else {
      validateType(value, type, path, rootState);
    }
  }
}

export { Model };
