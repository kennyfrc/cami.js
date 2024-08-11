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
    const errors = [];
    Object.entries(this.schema).forEach(([key, type]) => {
      if (!(key in state)) {
        const expectedType = this._getTypeString(type);
        errors.push(`Missing property: ${key}\nExpected type: ${expectedType}`);
      } else {
        try {
          this._validateItem(state[key], type, [key], state);
        } catch (error) {
          errors.push(error.message);
        }
      }
    });

    if (errors.length > 0) {
      throw new Error(`Validation error in ${this.name}:\n\n${errors.join('\n\n')}`);
    }
  }

  _validateItem(value, type, path, rootState) {
    try {
      if (type.type === 'optional') {
        if (value === undefined || value === null) {
          return; // Optional field is allowed to be undefined or null
        }
        return this._validateItem(value, type.optional, path, rootState);
      }

      if (type.type === 'object' && typeof value === 'object') {
        Object.entries(type.schema).forEach(([key, subType]) => {
          if (subType.type !== 'optional' && !(key in value)) {
            throw new Error(`Missing required property: ${[...path, key].join('.')}`);
          }
          if (key in value) {
            this._validateItem(value[key], subType, [...path, key], rootState);
          }
        });
      } else {
        validateType(value, type, path, rootState);
      }
    } catch (error) {
      const expectedType = this._getTypeString(type);
      const actualType = this._getActualTypeString(value);
      throw new Error(
        `Property: ${path.join('.')}\n` +
        `Error: ${error.message}`
      );
    }
  }

  _getTypeString(type) {
    if (typeof type === 'string') return type;
    if (typeof type === 'object') {
      if (type.type) {
        if (type.type === 'object' && type.schema) {
          return `Object(${Object.entries(type.schema).map(([k, v]) => `${k}: ${this._getTypeString(v)}`).join(', ')})`;
        }
        if (type.type === 'array' && type.itemType) {
          return `Array(${this._getTypeString(type.itemType)})`;
        }
        if (type.type === 'enum' && type.values) {
          return `Enum(${type.values.join(' | ')})`;
        }
        return type.type;
      }
      // Check for known Type constructors
      for (const [key, value] of Object.entries(Type)) {
        if (value === type || (typeof value === 'function' && type instanceof value)) {
          return key;
        }
      }
    }
    return 'Unknown';
  }

  _getActualTypeString(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'Array';
    if (value instanceof Date) return 'Date';
    if (typeof value === 'object') {
      const constructor = value.constructor.name;
      return constructor !== 'Object' ? constructor : 'object';
    }
    return typeof value;
  }
}

export { Model };
