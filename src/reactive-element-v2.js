import { render as _litRender } from "./html.js";
import { DependencyTracker, effect } from "./observables/observable-state.js";
import { _deepEqual } from "./utils";
import { interactionStore, deviceTypeFromUserAgent } from './interaction-store.js';

const defineReactiveElement = (name, store, renderFn) => {
    customElements.define(name, 
        class extends HTMLElement {
            constructor() {
                super();
                this.deviceType = deviceTypeFromUserAgent(navigator.userAgent);
            }

            connectedCallback() {
                this.updateViewportSize();
                this.isUpdating = false;
                effect(() => {
                    console.log(`Effect triggered`)
                    if (!this.isUpdating) {
                        this.isUpdating = true;
                        this.render();
                        this.isUpdating = false;
                    }
                });
            }

            disconnectedCallback() {
                // No need to remove event listeners as they are now global
            }

            updateViewportSize() {
                interactionStore.dispatch({
                    type: 'SET_VIEWPORT_SIZE',
                    payload: { width: window.innerWidth, height: window.innerHeight }
                });
            }

            render() {
                console.log(`Render called`)
                const ctx = interactionStore.getState();
                
                // Generate the template result
                const template = renderFn({ store, element: this, ctx });
                
                // Check if the template has actually changed
                if (this.__prevTemplate && _deepEqual(this.__prevTemplate, template)) {
                    console.log('Template unchanged, skipping render');
                    return;
                }
                
                // Store for future comparison
                this.__prevTemplate = template;
                
                // Render the template
                _litRender(template, this);
            }
        }
    )
}

export { defineReactiveElement };
