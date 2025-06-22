import { TemplateResult } from "./html.js";
type AttributeParser = (value: string) => any;
interface ObservableAttributes {
    [attrName: string]: AttributeParser;
}
interface SetupConfig {
    infer?: boolean;
}
type EffectFunction = () => void;
type DeriveFunction<T = any> = () => T;
type UnsubscribeFunction = () => void;
interface DeriveResult<T> {
    value: T;
    dispose: UnsubscribeFunction;
}
/**
 * ObservableProperty interface
 * A property that provides reactive getter/setter behavior
 */
interface ObservableProperty<T = any> {
    /** A getter function that returns the current value of the property */
    get(): T;
    /** A setter function that updates the value of the property */
    set(value: T): void;
}
/**
 * This class is needed to create reactive web components that can automatically update their view when their state changes.
 * All properties are automatically converted to observables. This is achieved by using creating an ObservableProperty,
 * which provides a getter and setter for the property. The getter returns the current value of the property,
 * and the setter updates the value of the property and triggers a re-render of the component.
 *
 * @example
 * ```typescript
 * const { html, ReactiveElement } = cami;
 *
 * class CounterElement extends ReactiveElement {
 *   // Here, 'count' is automatically initialized as an ObservableProperty.
 *   // This means that any changes to 'count' will automatically trigger a re-render of the component.
 *   count = 0
 *
 *   template() {
 *     return html`
 *       <button @click=${() => this.count--}>-</button>
 *       <button @click=${() => this.count++}>+</button>
 *       <div>Count: ${this.count}</div>
 *     `;
 *   }
 * }
 *
 * customElements.define('counter-component', CounterElement);
 * ```
 */
declare class ReactiveElement extends HTMLElement {
    private __unsubscribers;
    private __prevTemplate?;
    effect: (effectFn: EffectFunction) => void;
    derive: <T>(deriveFn: DeriveFunction<T>) => T;
    /**
     * Constructs a new instance of ReactiveElement.
     */
    constructor();
    /**
     * Creates ObservableProperty or ObservableProxy instances for all properties in the provided object.
     * @param attributes - An object with attribute names as keys and optional parsing functions as values.
     * @example
     * // In _009_dataFromProps.html, the todos attribute is parsed as JSON and the data property is extracted:
     * this.observableAttributes({
     *   todos: (v) => JSON.parse(v).data
     * });
     */
    observableAttributes(attributes: ObservableAttributes): void;
    /**
     * Creates an effect and registers its dispose function. The effect is used to perform side effects in response to state changes.
     * This method is useful when working with ObservableProperties or ObservableProxies because it triggers the effect whenever the value of the underlying ObservableState changes.
     * @param effectFn - The function to create the effect
     * @example
     * // Assuming `this.count` is an ObservableProperty
     * this.effect(() => {
     *   console.log(`The count is now: ${this.count}`);
     * });
     * // The console will log the current count whenever `this.count` changes
     */
    private __effect;
    /**
     * Creates a derived value that updates when its dependencies change.
     * @param deriveFn - The function to compute the derived value
     * @returns The derived value
     * @example
     * // Assuming `this.count` is an ObservableProperty
     * this.doubleCount = this.derive(() => this.count * 2);
     * console.log(this.doubleCount); // If this.count is 5, this will log 10
     */
    private __derive;
    /**
     * Called when the component is created. Can be overridden by subclasses to add initialization logic.
     * This method is a hook for the connectedCallback, which is invoked each time the custom element is appended into a document-connected element.
     */
    onCreate(): void;
    /**
     * Invoked when the custom element is appended into a document-connected element. Sets up initial state and triggers initial rendering.
     * This is typically used to initialize component state, fetch data, and set up event listeners.
     *
     * @example
     * // In a TodoList component
     * connectedCallback() {
     *   super.connectedCallback();
     *   this.fetchTodos(); // Fetch todos when the component is added to the DOM
     * }
     */
    connectedCallback(): void;
    /**
     * Invoked when the custom element is connected to the document's DOM.
     * Subclasses can override this to add initialization logic when the component is added to the DOM.
     *
     * @example
     * // In a UserCard component
     * onConnect() {
     *   this.showUserDetails(); // Display user details when the component is connected
     * }
     */
    onConnect(): void;
    /**
     * Invoked when the custom element is disconnected from the document's DOM.
     * This is a good place to remove event listeners, cancel any ongoing network requests, or clean up any resources.
     * @example
     * // In a Modal component
     * disconnectedCallback() {
     *   super.disconnectedCallback();
     *   this.close(); // Close the modal when it's disconnected from the DOM
     * }
     */
    disconnectedCallback(): void;
    /**
     * Invoked when the custom element is disconnected from the document's DOM.
     * Subclasses can override this to add cleanup logic when the component is removed from the DOM.
     *
     * @example
     * // In a VideoPlayer component
     * onDisconnect() {
     *   this.stopPlayback(); // Stop video playback when the component is removed
     * }
     */
    onDisconnect(): void;
    /**
     * Invoked when an attribute of the custom element is added, removed, updated, or replaced.
     * This can be used to react to attribute changes, such as updating the component state or modifying its appearance.
     *
     * @param name - The name of the attribute that changed
     * @param oldValue - The old value of the attribute
     * @param newValue - The new value of the attribute
     * @example
     * // In a ThemeSwitcher component
     * attributeChangedCallback(name, oldValue, newValue) {
     *   super.attributeChangedCallback(name, oldValue, newValue);
     *   if (name === 'theme') {
     *     this.updateTheme(newValue); // Update the theme when the `theme` attribute changes
     *   }
     * }
     */
    attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Invoked when an attribute of the custom element is added, removed, updated, or replaced.
     * Subclasses can override this to add logic that should run when an attribute changes.
     *
     * @param name - The name of the attribute that changed
     * @param oldValue - The old value of the attribute
     * @param newValue - The new value of the attribute
     * @example
     * // In a CollapsiblePanel component
     * onAttributeChange(name, oldValue, newValue) {
     *   if (name === 'collapsed') {
     *     this.toggleCollapse(newValue === 'true'); // Toggle collapse when the `collapsed` attribute changes
     *   }
     * }
     */
    onAttributeChange(name: string, oldValue: string | null, newValue: string | null): void;
    /**
     * Invoked when the custom element is moved to a new document.
     * This can be used to update bindings or perform re-initialization as needed when the component is adopted into a new DOM context.
     * @example
     * // In a DragDropContainer component
     * adoptedCallback() {
     *   super.adoptedCallback();
     *   this.updateDragDropContext(); // Update context when the component is moved to a new document
     * }
     */
    adoptedCallback(): void;
    /**
     * Invoked when the custom element is moved to a new document.
     * Subclasses can override this to add logic that should run when the component is moved to a new document.
     * @example
     * // In a DataGrid component
     * onAdopt() {
     *   this.refreshData(); // Refresh data when the component is adopted into a new document
     * }
     */
    onAdopt(): void;
    /**
     * Checks if the provided value is an object or an array.
     * @param value - The value to check.
     * @returns True if the value is an object or an array, false otherwise.
     */
    private __isObjectOrArray;
    /**
     * Private method. Creates an ObservableProperty for the provided key in the given context when the provided value is an object or an array.
     * @param context - The context in which the property is defined.
     * @param key - The property key.
     * @param observable - The observable to bind to the property.
     * @param isAttribute - Whether the property is an attribute.
     * @throws {TypeError} If observable is not an instance of ObservableState.
     */
    private __createObservablePropertyForObjOrArr;
    /**
     * Private method. Handles the case when the provided value is not an object or an array.
     * This method creates an ObservableProperty for the provided key in the given context.
     * An ObservableProperty is a special type of property that can notify about changes in its state.
     * This is achieved by defining a getter and a setter for the property using Object.defineProperty.
     * The getter simply returns the current value of the observable.
     * The setter updates the observable with the new value and, if the property is an attribute, also updates the attribute.
     * @param context - The context in which the property is defined.
     * @param key - The property key.
     * @param observable - The observable to bind to the property.
     * @param isAttribute - Whether the property is an attribute.
     * @throws {TypeError} If observable is not an instance of ObservableState.
     */
    private __createObservablePropertyForPrimitive;
    /**
     * Creates a proxy for the observable.
     * @param observable - The observable for which a proxy is to be created.
     * @throws {TypeError} If observable is not an instance of ObservableState.
     * @returns The created proxy.
     */
    private __observableProxy;
    /**
     * Defines the observables, effects, and attributes for the element.
     * @param config - The configuration object.
     */
    private __setup;
    /**
     * Creates an observable with an initial value.
     * @param initialValue - The initial value for the observable.
     * @param name - The name of the observable.
     * @throws {Error} If the type of initialValue is not allowed in observables.
     * @returns The created observable state.
     */
    private __observable;
    /**
     * Checks if the provided value is of an allowed type
     * @param value - The value to check
     * @returns True if the value is of an allowed type, false otherwise
     */
    private __isAllowedType;
    /**
     * Checks if the provided value is a plain object
     * @param value - The value to check
     * @returns True if the value is a plain object, false otherwise
     */
    private __isPlainObject;
    /**
     * Registers an observable state to the list of unsubscribers
     * @param observableState - The observable state to register
     */
    private __registerObservables;
    /**
     * Hook called after rendering. Can be overridden by subclasses.
     */
    afterRender(): void;
    /**
     * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
     * Uses memoization to avoid unnecessary rendering when the template result hasn't changed.
     */
    render(): void;
    /**
     * Template method that should be overridden by subclasses to define the component's template.
     * @returns The template result for rendering
     */
    template?(): TemplateResult;
    /**
     * Warns if required properties are missing from the component.
     * @param properties - Array of property names to check
     */
    warnIfMissingProperties(properties: string[]): void;
}
export type { ObservableProperty, AttributeParser, ObservableAttributes, SetupConfig, EffectFunction, DeriveFunction, UnsubscribeFunction, DeriveResult };
export { ReactiveElement };
//# sourceMappingURL=reactive-element.d.ts.map