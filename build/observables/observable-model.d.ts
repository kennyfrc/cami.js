import { TypeDefinition, InferType } from "../types/index";
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
export type InferModelState<TSchema extends Record<string, TypeDefinition>> = {
  [K in keyof TSchema]: InferType<TSchema[K]>;
};
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
export declare class Model<
  TSchema extends Record<string, TypeDefinition> = Record<
    string,
    TypeDefinition
  >,
> {
  readonly name: string;
  readonly schema: TSchema;
  constructor({ name, properties }?: ModelConstructorOptions<TSchema>);
  /**
   * Creates an observable store with the given configuration
   * @param config - Configuration object containing state, actions, and other store features
   * @returns An ObservableStore instance configured with this model's schema
   */
  create<TState extends InferModelState<TSchema>>(
    config: ModelConfig<TState>,
  ): ObservableStore<TState>;
  /**
   * Validates a state object against this model's schema
   * @param state - The state object to validate
   * @throws {Error} If validation fails
   */
  validateState(state: any): void;
  /**
   * Validates a single item against its type definition
   * @param value - The value to validate
   * @param type - The type definition to validate against
   * @param path - The current path in the object for error reporting
   * @param rootState - The root state object for reference validation
   */
  validateItem(
    value: any,
    type: TypeDefinition,
    path: string[],
    rootState: any,
  ): void;
  /**
   * Helper function to get a human-readable string representation of expected type
   * @param type - The type definition
   * @returns A string representation of the expected type
   */
  private _getExpectedTypeString;
}
export { Model as default };
//# sourceMappingURL=observable-model.d.ts.map
