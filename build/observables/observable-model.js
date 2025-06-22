import { store } from "./observable-store.js";
import { Type, validateType } from "../types/index.js";
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
function generateRandomName() {
    // Simple UUID-like random string generator
    return "model_" + Math.random().toString(36).substr(2, 9);
}
class Model {
    constructor({ name = generateRandomName(), properties = {} } = {}) {
        this.name = name;
        this.schema = properties;
    }
    create(config) {
        const { state, actions = {}, asyncActions = {}, machines = {}, queries = {}, mutations = {}, specs = {}, memos = {}, options = {}, } = config;
        this.validateState(state);
        const modelStore = store({
            state,
            name: this.name,
            schema: this.schema,
            ...options,
        });
        Object.entries(actions).forEach(([actionName, actionFn]) => {
            modelStore.defineAction(actionName, (context) => {
                actionFn(context);
                this.validateState(context.state);
            });
        });
        Object.entries(asyncActions).forEach(([thunkName, thunkFn]) => {
            modelStore.defineAsyncAction(thunkName, async (context) => {
                await thunkFn(context);
                this.validateState(context.state);
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
                onSettled: queryConfig.onSettled,
            });
        });
        Object.entries(mutations).forEach(([mutationName, mutationConfig]) => {
            modelStore.defineMutation(mutationName, {
                mutationFn: mutationConfig.mutationFn,
                onMutate: mutationConfig.onMutate,
                onSuccess: mutationConfig.onSuccess,
                onError: mutationConfig.onError,
                onSettled: mutationConfig.onSettled,
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
    validateState(state) {
        const errors = [];
        Object.entries(this.schema).forEach(([key, type]) => {
            if (!(key in state)) {
                const expectedType = this.__getExpectedTypeString(type);
                errors.push(`Missing property: ${key}\nExpected type: ${expectedType}`);
            }
            else {
                try {
                    this.validateItem(state[key], type, [key], state);
                }
                catch (error) {
                    errors.push(error.message);
                }
            }
        });
        if (errors.length > 0) {
            throw new Error(`Validation error in ${this.name}:\n\n${errors.join("\n\n")}`);
        }
    }
    validateItem(value, type, path, rootState) {
        const getTypeCategory = (type, value) => {
            if (type.type === "optional")
                return "optional";
            if (type.type === "object" && typeof value === "object")
                return "object";
            return "other";
        };
        try {
            const typeCategory = getTypeCategory(type, value);
            switch (typeCategory) {
                case "optional":
                    if (value === undefined || value === null)
                        return;
                    return this.validateItem(value, type.optional, path, rootState);
                case "object":
                    Object.entries(type.schema).forEach(([key, subType]) => {
                        if (subType.type !== "optional" && !(key in value)) {
                            throw new Error(`Missing required property: ${[...path, key].join(".")}`);
                        }
                        if (key in value) {
                            this.validateItem(value[key], subType, [...path, key], rootState);
                        }
                    });
                    break;
                case "other":
                    validateType(value, type, path, rootState);
                    break;
                default:
                    throw new Error(`Unexpected type category: ${typeCategory}`);
            }
        }
        catch (error) {
            const expectedType = this.__getExpectedTypeString(type);
            const actualType = this.__getActualTypeString(value);
            throw new Error(`Property: ${path.join(".")}\n` + `Error: ${error.message}`);
        }
    }
    // Below are just helper functions to express types when there are validation errors
    __getExpectedTypeString(type) {
        const getTypeCategory = (type) => {
            if (typeof type === "string")
                return "string";
            if (typeof type === "object") {
                if (type.type) {
                    if (type.type === "object" && type.schema)
                        return "objectWithSchema";
                    if (type.type === "array" && type.itemType)
                        return "array";
                    if (type.type === "enum" && type.values)
                        return "enum";
                    return "simpleType";
                }
                return "typeConstructor";
            }
            return "unknown";
        };
        const typeCategory = getTypeCategory(type);
        switch (typeCategory) {
            case "string":
                return type;
            case "objectWithSchema":
                return `Object(${Object.entries(type.schema)
                    .map(([k, v]) => `${k}: ${this.__getExpectedTypeString(v)}`)
                    .join(", ")})`;
            case "array":
                return `Array(${this.__getExpectedTypeString(type.itemType)})`;
            case "enum":
                return `Enum(${type.values.join(" | ")})`;
            case "simpleType":
                return type.type;
            case "typeConstructor":
                for (const [key, value] of Object.entries(Type)) {
                    if (value === type ||
                        (typeof value === "function" && type instanceof value)) {
                        return key;
                    }
                }
                return "Unknown";
            case "unknown":
            default:
                return "Unknown";
        }
    }
    __getActualTypeString(value) {
        const getValueType = (value) => {
            if (value === null)
                return "null";
            if (Array.isArray(value))
                return "array";
            if (value instanceof Date)
                return "date";
            if (typeof value === "object")
                return "object";
            return typeof value;
        };
        const valueType = getValueType(value);
        switch (valueType) {
            case "null":
                return "null";
            case "array":
                return "Array";
            case "date":
                return "Date";
            case "object":
                const constructor = value.constructor.name;
                return constructor !== "Object" ? constructor : "object";
            default:
                return valueType;
        }
    }
}
export { Model };
//# sourceMappingURL=observable-model.js.map