import { store } from "./observable-store.js";
import { Type, validateType, TypeDefinition, InferType } from "../types/index";
import type {
  ObservableStore,
  StoreConfig,
  ActionHandler,
  QueryConfig,
  MutationConfig,
  StateMachineDefinition,
  MemoHandler,
  AsyncActionHandler,
  ActionSpec,
} from "./observable-store.js";

// =============================================================================
// Type Definitions for Model Configuration
// =============================================================================

export interface ModelConfig<TState = any> {
  state: TState;
  actions?: Record<string, ActionHandler<TState>>;
  asyncActions?: Record<string, AsyncActionHandler<TState>>;
  machines?: Record<string, StateMachineDefinition<TState>>;
  queries?: Record<string, QueryConfig>;
  mutations?: Record<string, MutationConfig>;
  specs?: Record<string, ActionSpec<TState>>;
  memos?: Record<string, MemoHandler<TState>>;
  options?: StoreConfig<TState>;
}

export interface ModelConstructorOptions<
  TSchema extends Record<string, TypeDefinition> = Record<
    string,
    TypeDefinition
  >,
> {
  name?: string;
  properties?: TSchema;
}

export interface ValidationError {
  message: string;
  path: string[];
  expectedType?: string;
  actualType?: string;
}

// Type inference from schema
export type InferModelState<TSchema extends Record<string, TypeDefinition>> = {
  [K in keyof TSchema]: InferType<TSchema[K]>;
};

// =============================================================================
// Utility Functions
// =============================================================================

/**
 * Generates a random model name for anonymous models
 * @returns {string} A unique model name
 */
function generateRandomName(): string {
  return "model_" + Math.random().toString(36).substr(2, 9);
}

// =============================================================================
// Model Class
// =============================================================================

/**
 * Represents a Model with schema-based validation in the application.
 *
 * @template TSchema - The schema definition for the model
 *
 * @example
 * ```typescript
 * const Department = Type.Model("Department", {
 *   id: Type.Integer,
 *   name: Type.String
 * });
 *
 * const Employee = Type.Model("Employee", {
 *   id: Type.Integer,
 *   name: Type.String,
 *   department: Type.Reference("Department")
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
 * ```
 */
export class Model<
  TSchema extends Record<string, TypeDefinition> = Record<
    string,
    TypeDefinition
  >,
> {
  public readonly name: string;
  public readonly schema: TSchema;

  constructor({
    name = generateRandomName(),
    properties = {} as TSchema,
  }: ModelConstructorOptions<TSchema> = {}) {
    this.name = name;
    this.schema = properties;
  }

  /**
   * Creates an observable store with the given configuration
   * @param config - Configuration object containing state, actions, and other store features
   * @returns An ObservableStore instance configured with this model's schema
   */
  create<TState extends InferModelState<TSchema>>(
    config: ModelConfig<TState>,
  ): ObservableStore<TState> {
    const {
      state,
      actions = {},
      asyncActions = {},
      machines = {},
      queries = {},
      mutations = {},
      specs = {},
      memos = {},
      options = {},
    } = config;

    // Validate the initial state against the schema
    this.validateState(state);

    // Create the observable store with schema information
    const modelStore = store<TState>({
      state,
      name: this.name,
      schema: this.schema,
      ...options,
    });

    // Register actions with validation
    Object.entries(actions).forEach(([actionName, actionFn]) => {
      modelStore.defineAction(actionName, (context) => {
        actionFn(context);
        this.validateState(context.state);
      });
    });

    // Register async actions with validation
    Object.entries(asyncActions).forEach(([thunkName, thunkFn]) => {
      modelStore.defineAsyncAction(thunkName, async (context) => {
        await thunkFn(context);
        this.validateState(context.state);
      });
    });

    // Register state machines
    Object.entries(machines).forEach(([machineName, machineDefinition]) => {
      modelStore.defineMachine(machineName, machineDefinition);
    });

    // Register queries
    Object.entries(queries).forEach(([queryName, queryConfig]) => {
      modelStore.defineQuery(queryName, {
        queryKey: queryConfig.queryKey,
        queryFn: queryConfig.queryFn,
        ...(queryConfig.onFetch && { onFetch: queryConfig.onFetch }),
        ...(queryConfig.onError && { onError: queryConfig.onError }),
        ...(queryConfig.onSuccess && { onSuccess: queryConfig.onSuccess }),
        ...(queryConfig.onSettled && { onSettled: queryConfig.onSettled }),
      });
    });

    // Register mutations
    Object.entries(mutations).forEach(([mutationName, mutationConfig]) => {
      modelStore.defineMutation(mutationName, {
        mutationFn: mutationConfig.mutationFn,
        ...(mutationConfig.onMutate && { onMutate: mutationConfig.onMutate }),
        ...(mutationConfig.onSuccess && { onSuccess: mutationConfig.onSuccess }),
        ...(mutationConfig.onError && { onError: mutationConfig.onError }),
        ...(mutationConfig.onSettled && { onSettled: mutationConfig.onSettled }),
      });
    });

    // Register action specifications
    Object.entries(specs).forEach(([actionName, spec]) => {
      modelStore.defineSpec(actionName, spec);
    });

    // Register memos
    Object.entries(memos).forEach(([memoName, memoFn]) => {
      modelStore.defineMemo(memoName, memoFn);
    });

    return modelStore;
  }

  /**
   * Validates a state object against this model's schema
   * @param state - The state object to validate
   * @throws {Error} If validation fails
   */
  validateState(state: unknown): void {
    const errors: string[] = [];
    const recordState = state as Record<string, unknown>;

    Object.entries(this.schema).forEach(([key, type]) => {
      if (!(key in recordState)) {
        const expectedType = this._getExpectedTypeString(type);
        errors.push(`Missing property: ${key}\nExpected type: ${expectedType}`);
      } else {
        try {
          this.validateItem(recordState[key], type, [key], state);
        } catch (error) {
          errors.push((error as Error).message);
        }
      }
    });

    if (errors.length > 0) {
      throw new Error(
        `Validation error in ${this.name}:\n\n${errors.join("\n\n")}`,
      );
    }
  }

  /**
   * Validates a single item against its type definition
   * @param value - The value to validate
   * @param type - The type definition to validate against
   * @param path - The current path in the object for error reporting
   * @param rootState - The root state object for reference validation
   */
  validateItem(
    value: unknown,
    type: TypeDefinition,
    path: string[],
    rootState: unknown,
  ): void {
    const getTypeCategory = (type: TypeDefinition, value: unknown): string => {
      if (typeof type === "object" && type !== null && "type" in type) {
        if (type.type === "optional") return "optional";
        if (type.type === "object" && typeof value === "object")
          return "object";
      }
      return "other";
    };

    try {
      const typeCategory = getTypeCategory(type, value);

      switch (typeCategory) {
        case "optional":
          if (value === undefined || value === null) return;
          const optionalType = type as {
            type: "optional";
            optional: TypeDefinition;
          };
          return this.validateItem(
            value,
            optionalType.optional,
            path,
            rootState,
          );

        case "object":
          const objectType = type as {
            type: "object";
            schema: Record<string, TypeDefinition>;
          };
          const objectValue = value as Record<string, unknown>;
          Object.entries(objectType.schema).forEach(([key, subType]) => {
            const isOptional =
              typeof subType === "object" &&
              subType !== null &&
              "type" in subType &&
              subType.type === "optional";

            if (!isOptional && !(key in objectValue)) {
              throw new Error(
                `Missing required property: ${[...path, key].join(".")}`,
              );
            }

            if (key in objectValue) {
              this.validateItem(objectValue[key], subType, [...path, key], rootState);
            }
          });
          break;

        case "other":
          validateType(value, type, path, rootState);
          break;

        default:
          throw new Error(`Unexpected type category: ${typeCategory}`);
      }
    } catch (error) {
      // const expectedType = this._getExpectedTypeString(type);
      throw new Error(
        `Property: ${path.join(".")}\n` + `Error: ${(error as Error).message}`,
      );
    }
  }

  /**
   * Helper function to get a human-readable string representation of expected type
   * @param type - The type definition
   * @returns A string representation of the expected type
   */
  private _getExpectedTypeString(type: TypeDefinition): string {
    const getTypeCategory = (type: TypeDefinition): string => {
      if (typeof type === "string") return "string";
      if (typeof type === "object" && type !== null) {
        if ("type" in type) {
          if (type.type === "object" && "schema" in type)
            return "objectWithSchema";
          if (type.type === "array" && "itemType" in type) return "array";
          if (type.type === "enum" && "values" in type) return "enum";
          if (type.type === "optional") return "optional";
          return "simpleType";
        }
        return "typeConstructor";
      }
      return "unknown";
    };

    const typeCategory = getTypeCategory(type);

    switch (typeCategory) {
      case "string":
        return type as string;

      case "objectWithSchema":
        const objectType = type as {
          type: "object";
          schema: Record<string, TypeDefinition>;
        };
        return `Object(${Object.entries(objectType.schema)
          .map(([k, v]) => `${k}: ${this._getExpectedTypeString(v)}`)
          .join(", ")})`;

      case "array":
        const arrayType = type as { type: "array"; itemType: TypeDefinition };
        return `Array(${this._getExpectedTypeString(arrayType.itemType)})`;

      case "enum":
        const enumType = type as { type: "enum"; values: unknown[] };
        return `Enum(${enumType.values.join(" | ")})`;

      case "optional":
        const optionalType = type as {
          type: "optional";
          optional: TypeDefinition;
        };
        return `Optional(${this._getExpectedTypeString(optionalType.optional)})`;

      case "simpleType":
        const simpleType = type as { type: string };
        return simpleType.type;

      case "typeConstructor":
        // Look for the type in the Type object
        for (const [key, value] of Object.entries(Type)) {
          if (
            value === type ||
            (typeof value === "function" && type instanceof (value as unknown as new (...args: unknown[]) => unknown))
          ) {
            return key;
          }
        }
        return "Unknown";

      case "unknown":
      default:
        return "Unknown";
    }
  }
}

// =============================================================================
// Exports
// =============================================================================

export { Model as default };
