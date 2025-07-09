import { render as __litRender } from "./html";
import { produce } from "immer";
import { Observable } from "./observables/observable";
import { ObservableState, effect, derive, } from "./observables/observable-state";
import { ObservableProxy } from "./observables/observable-proxy";
import { _deepEqual } from "./utils";
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
class ReactiveElement extends HTMLElement {
    __unsubscribers;
    __prevTemplate;
    // Public effect and derive methods (bound in constructor)
    effect;
    derive;
    /**
     * Constructs a new instance of ReactiveElement.
     */
    constructor() {
        super();
        this.onCreate();
        this.__unsubscribers = new Map();
        this.effect = this.__effect.bind(this);
        this.derive = this.__derive.bind(this);
    }
    /**
     * Creates ObservableProperty or ObservableProxy instances for all properties in the provided object.
     * @param attributes - An object with attribute names as keys and optional parsing functions as values.
     * @example
     * // In _009_dataFromProps.html, the todos attribute is parsed as JSON and the data property is extracted:
     * this.observableAttributes({
     *   todos: (v) => JSON.parse(v).data
     * });
     */
    observableAttributes(attributes) {
        Object.entries(attributes).forEach(([attrName, parseFn]) => {
            // Retrieve the attribute value and apply the transformation function if provided
            let attrValue = this.getAttribute(attrName);
            const transformFn = typeof parseFn === "function" ? parseFn : (v) => v;
            const transformedValue = produce(attrValue, transformFn);
            // Create an ObservableProperty or ObservableProxy for the attribute
            const observable = this.__observable(transformedValue, attrName);
            if (this.__isObjectOrArray(observable.value)) {
                this.__createObservablePropertyForObjOrArr(this, attrName, observable, true);
            }
            else {
                this.__createObservablePropertyForPrimitive(this, attrName, observable, true);
            }
        });
    }
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
    __effect(effectFn) {
        const dispose = effect(effectFn);
        this.__unsubscribers.set(effectFn, dispose);
    }
    /**
     * Creates a derived value that updates when its dependencies change.
     * @param deriveFn - The function to compute the derived value
     * @returns The derived value
     * @example
     * // Assuming `this.count` is an ObservableProperty
     * this.doubleCount = this.derive(() => this.count * 2);
     * console.log(this.doubleCount); // If this.count is 5, this will log 10
     */
    __derive(deriveFn) {
        const { value, dispose } = derive(deriveFn);
        this.__unsubscribers.set(deriveFn, dispose);
        return value;
    }
    /**
     * Called when the component is created. Can be overridden by subclasses to add initialization logic.
     * This method is a hook for the connectedCallback, which is invoked each time the custom element is appended into a document-connected element.
     */
    onCreate() {
        // Default implementation does nothing.
        // Subclasses can override this to add initialization logic.
    }
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
    connectedCallback() {
        this.__setup({ infer: true });
        this.effect(() => {
            this.render();
        });
        this.render();
        this.onConnect();
    }
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
    onConnect() {
        // Default implementation does nothing.
    }
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
    disconnectedCallback() {
        this.onDisconnect();
        this.__unsubscribers.forEach((unsubscribe) => unsubscribe());
    }
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
    onDisconnect() {
        // Default implementation does nothing.
    }
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
    attributeChangedCallback(name, oldValue, newValue) {
        this.onAttributeChange(name, oldValue, newValue);
    }
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
    onAttributeChange(_name, _oldValue, _newValue) {
        // Default implementation does nothing.
    }
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
    adoptedCallback() {
        this.onAdopt();
    }
    /**
     * Invoked when the custom element is moved to a new document.
     * Subclasses can override this to add logic that should run when the component is moved to a new document.
     * @example
     * // In a DataGrid component
     * onAdopt() {
     *   this.refreshData(); // Refresh data when the component is adopted into a new document
     * }
     */
    onAdopt() {
        // Default implementation does nothing.
    }
    /**
     * Checks if the provided value is an object or an array.
     * @param value - The value to check.
     * @returns True if the value is an object or an array, false otherwise.
     */
    __isObjectOrArray(value) {
        return (value !== null && (typeof value === "object" || Array.isArray(value)));
    }
    /**
     * Private method. Creates an ObservableProperty for the provided key in the given context when the provided value is an object or an array.
     * @param context - The context in which the property is defined.
     * @param key - The property key.
     * @param observable - The observable to bind to the property.
     * @param isAttribute - Whether the property is an attribute.
     * @throws {TypeError} If observable is not an instance of ObservableState.
     */
    __createObservablePropertyForObjOrArr(context, key, observable, isAttribute = false) {
        if (!(observable instanceof ObservableState)) {
            throw new TypeError("Expected observable to be an instance of ObservableState");
        }
        const proxy = this.__observableProxy(observable);
        Object.defineProperty(context, key, {
            get: () => proxy,
            set: (newValue) => {
                observable.update(() => newValue);
                if (isAttribute) {
                    this.setAttribute(key, newValue);
                }
            },
        });
    }
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
    __createObservablePropertyForPrimitive(context, key, observable, isAttribute = false) {
        if (!(observable instanceof ObservableState)) {
            throw new TypeError("Expected observable to be an instance of ObservableState");
        }
        Object.defineProperty(context, key, {
            get: () => observable.value,
            set: (newValue) => {
                observable.update(() => newValue);
                if (isAttribute) {
                    this.setAttribute(key, newValue);
                }
            },
        });
    }
    /**
     * Creates a proxy for the observable.
     * @param observable - The observable for which a proxy is to be created.
     * @throws {TypeError} If observable is not an instance of ObservableState.
     * @returns The created proxy.
     */
    __observableProxy(observable) {
        return new ObservableProxy(observable);
    }
    /**
     * Defines the observables, effects, and attributes for the element.
     * @param config - The configuration object.
     */
    __setup(config) {
        if (config.infer === true) {
            const keys = Object.keys(this);
            const keysLen = keys.length;
            // Using direct for loop instead of forEach for better performance
            for (let i = 0; i < keysLen; i++) {
                const key = keys[i];
                const value = this[key];
                if (typeof value !== "function" && !key.startsWith("__")) {
                    if (value instanceof Observable) {
                        continue;
                    }
                    else {
                        const observable = this.__observable(value, key);
                        if (this.__isObjectOrArray(observable.value)) {
                            this.__createObservablePropertyForObjOrArr(this, key, observable);
                        }
                        else {
                            this.__createObservablePropertyForPrimitive(this, key, observable);
                        }
                    }
                }
            }
        }
    }
    /**
     * Creates an observable with an initial value.
     * @param initialValue - The initial value for the observable.
     * @param name - The name of the observable.
     * @throws {Error} If the type of initialValue is not allowed in observables.
     * @returns The created observable state.
     */
    __observable(initialValue, name) {
        if (!this.__isAllowedType(initialValue)) {
            const type = Object.prototype.toString.call(initialValue);
            throw new Error(`[Cami.js] The value of type ${type} is not allowed in observables. Only primitive values, arrays, and plain objects are allowed.`);
        }
        const observable = new ObservableState(initialValue, null, { name });
        this.__registerObservables(observable);
        return observable;
    }
    /**
     * Checks if the provided value is of an allowed type
     * @param value - The value to check
     * @returns True if the value is of an allowed type, false otherwise
     */
    __isAllowedType(value) {
        const allowedTypes = ["number", "string", "boolean", "object", "undefined"];
        const valueType = typeof value;
        if (valueType === "object") {
            return (value === null || Array.isArray(value) || this.__isPlainObject(value));
        }
        return allowedTypes.includes(valueType);
    }
    /**
     * Checks if the provided value is a plain object
     * @param value - The value to check
     * @returns True if the value is a plain object, false otherwise
     */
    __isPlainObject(value) {
        if (Object.prototype.toString.call(value) !== "[object Object]") {
            return false;
        }
        const prototype = Object.getPrototypeOf(value);
        return prototype === null || prototype === Object.prototype;
    }
    /**
     * Registers an observable state to the list of unsubscribers
     * @param observableState - The observable state to register
     */
    __registerObservables(observableState) {
        if (!(observableState instanceof ObservableState)) {
            throw new TypeError("Expected observableState to be an instance of ObservableState");
        }
        // Only effects have a dispose method - use direct property access for speed
        this.__unsubscribers.set(observableState, () => {
            const dispose = observableState.dispose;
            if (typeof dispose === "function") {
                dispose.call(observableState);
            }
        });
    }
    /**
     * Hook called after rendering. Can be overridden by subclasses.
     */
    afterRender() {
        // no-op. just a hook for the user.
    }
    /**
     * This method is responsible for updating the view whenever the state changes. It does this by rendering the template with the current state.
     * Uses memoization to avoid unnecessary rendering when the template result hasn't changed.
     */
    render() {
        if (typeof this.template === "function") {
            // Call template function and get the result
            const template = this.template();
            // Using reference equality first (faster) before deep equal check
            if (this.__prevTemplate === template)
                return;
            // Check if we have a previous template result to compare with
            if (this.__prevTemplate && _deepEqual(this.__prevTemplate, template)) {
                // If the template hasn't changed, no need to re-render
                return;
            }
            // Store the current template for future comparison
            this.__prevTemplate = template;
            // Render the template
            __litRender(template, this);
            this.afterRender();
        }
    }
    /**
     * Warns if required properties are missing from the component.
     * @param properties - Array of property names to check
     */
    warnIfMissingProperties(properties) {
        const missingProperties = properties.filter(prop => !(prop in this));
        if (missingProperties.length > 0) {
            console.warn(`Missing required properties: ${missingProperties.join(', ')}`);
        }
    }
}
export { ReactiveElement };
//# sourceMappingURL=reactive-element.js.map