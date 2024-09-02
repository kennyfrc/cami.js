import { render as _litRender } from "./html.js";
import { DependencyTracker, effect } from "./observables/observable-state.js"

const interactionContextSchema = {
    active: { owner: 'window' },
    focused: { owner: 'window' },
    hovered: { owner: 'window' },
    clicked: { owner: null, x: null, y: null },
    dragging: {
        status: 'idle',
        owner: 'window',
        startX: null,
        startY: null,
        currentX: null,
        currentY: null,
        sourceId: null,
        targetId: null,
        initialOffsetX: null,
        initialOffsetY: null
    },
    resizing: {
        status: 'idle',
        owner: 'window',
        startX: null,
        startY: null,
        currentX: null,
        currentY: null,
        initialWidth: null,
        initialHeight: null
    },
    keyPressed: { key: null, owner: 'window' },
    keyPressBuffer: [],
    lastKeyPressTime: null,
    viewportSize: { width: 0, height: 0 }
};

const interactionContextFromWindow = () => ({
    ...interactionContextSchema,
    viewportSize: { width: window.innerWidth, height: window.innerHeight }
});

const deviceTypeFromUserAgent = (userAgent) => {
    if (/Tablet|iPad/i.test(userAgent)) return 'tablet';
    if (/IEMobile|Windows Phone|Android|webOS|iPhone|iPod|BlackBerry|Opera Mini/i.test(userAgent)) return 'mobile';
    return 'desktop';
};

const eventsFromDeviceType = (deviceType) => {
    const commonEvents = [
        'focus', 'blur', 'focusin', 'focusout',
        'keydown', 'keyup',
        'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave',
        'touchstart', 'touchend', 'touchmove', 'touchcancel',
        'resize', 'orientationchange',
        'dragstart', 'drag', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop',
        'scroll', 'wheel',
        'click'  // Added 'click' event
    ];

    const mobileEvents = [
        'devicemotion', 'deviceorientation'
    ];

    return deviceType === 'mobile' || deviceType === 'tablet' 
        ? [...commonEvents, ...mobileEvents]
        : commonEvents;
};

const touchToMouseMap = {
    'touchstart': 'mousedown',
    'touchend': 'mouseup',
    'touchmove': 'mousemove',
    'touchcancel': 'mouseout'
};

const createMicroStore = (initialState, reducer = state => state) => {
    let state = initialState;
    let stateKeys = Object.keys(initialState);
    let subscribers = new Set();

    const stateProxy = new Proxy(state, {
        get(target, prop) {
            if (DependencyTracker.current) {
                DependencyTracker.current.addDependency({ onValue: (callback) => {
                    subscribers.add(callback);
                    return {
                        unsubscribe: () => subscribers.delete(callback)
                    };
                }});
            }
            return state[prop];
        },
        ownKeys() {
            return stateKeys;
        },
        getOwnPropertyDescriptor(target, prop) {
            return {
                enumerable: true,
                configurable: true,
                value: state[prop]
            };
        }
    });

    function getState() {
        return stateProxy;
    }

    function dispatch(action) {
        const oldState = { ...state };
        state = reducer(state, action);

        stateKeys = Object.keys(state);

        if (JSON.stringify(oldState) !== JSON.stringify(state)) {
            subscribers.forEach(subscriber => subscriber());
        }
    }

    return { getState, dispatch };
}

const createInteractionReducer = (initialState) => (state = initialState, action) => {
    switch (action.type) {
        case 'SET_FOCUSED':
            return { ...state, focused: { owner: action.payload || 'window' } };
        case 'SET_HOVERED':
            return { ...state, hovered: { owner: action.payload || 'window' } };
        case 'SET_ACTIVE':
            return { ...state, active: { owner: action.payload || 'window' } };
        case 'SET_CLICKED':
            return { ...state, clicked: action.payload };
        case 'CLEAR_CLICKED':
            return { ...state, clicked: { owner: null, x: null, y: null } };
        case 'SET_DRAGGING':
            return { ...state, dragging: { ...action.payload, owner: action.payload.owner || 'window' } };
        case 'SET_RESIZING':
            return { ...state, resizing: { ...action.payload, status: action.payload.status || null } };
        case 'SET_KEY_PRESSED':
            return { ...state, keyPressed: { ...action.payload, owner: action.payload.owner || 'window' } };
        case 'SET_KEY_PRESS_BUFFER':
            return { ...state, keyPressBuffer: action.payload };
        case 'SET_LAST_KEY_PRESS_TIME':
            return { ...state, lastKeyPressTime: action.payload };
        case 'SET_VIEWPORT_SIZE':
            return { ...state, viewportSize: action.payload };
        default:
            return state;
    }
};

const interactionReducer = createInteractionReducer(interactionContextFromWindow());
const interactionStore = createMicroStore(interactionContextFromWindow(), interactionReducer);

const keyPressBufferFromEvent = (store, event, targetId) => {
    const { keyPressBuffer } = store.getState();
    let newBuffer = new Set(keyPressBuffer);

    if (event.type === 'keydown') {
        newBuffer.add(event.key);
    } else if (event.type === 'keyup') {
        newBuffer.delete(event.key);
        newBuffer.delete('Meta');
    }

    const sortedBuffer = Array.from(newBuffer).sort().join('+');

    return [
        { type: 'SET_KEY_PRESS_BUFFER', payload: Array.from(newBuffer) },
        { type: 'SET_KEY_PRESSED', payload: { key: sortedBuffer, owner: targetId } }
    ];
};

const actionFromEventType = (type, store) => (event) => {
    const targetId = event.target instanceof Element ? event.target.closest('[node-id]')?.getAttribute('node-id') : 'window';
    const draggingState = store.getState().dragging;
    const resizingState = store.getState().resizing;
    const viewportSize = store.getState().viewportSize;

    const coordinatesFromEvent = (evt) => {
        return evt.touches ? { clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY } : evt;
    };

    switch (type) {
        case 'focus':
            return { type: 'SET_FOCUSED', payload: targetId };
        case 'blur':
            return { type: 'SET_FOCUSED', payload: null };
        case 'mouseover':
        case 'touchstart':
            return { type: 'SET_HOVERED', payload: targetId };
        case 'mouseout':
        case 'touchend':
        case 'touchcancel':
            return { type: 'SET_HOVERED', payload: null };
        case 'click':
            const { clientX, clientY } = coordinatesFromEvent(event);
            return [
                { type: 'SET_CLICKED', payload: { owner: targetId, x: clientX, y: clientY } },
                { type: 'CLEAR_CLICKED', payload: { owner: targetId, x: clientX, y: clientY } }
            ];
        case 'mousedown':
        case 'touchstart':
            if (targetId?.startsWith('resize-handle')) {
                const resizeDirection = targetId.split('-').slice(2).join('-');
                const targetElement = event.target.closest('.window');
                const rect = targetElement.getBoundingClientRect();
                return {
                    type: 'SET_RESIZING',
                    payload: {
                        status: `resizing-${resizeDirection}`,
                        owner: targetId,
                        initialWidth: rect.width,
                        initialHeight: rect.height,
                        startX: event.clientX,
                        startY: event.clientY,
                        currentX: event.clientX,
                        currentY: event.clientY
                    }
                };
            }
            return [
                { 
                    type: 'SET_DRAGGING', 
                    payload: { 
                        status: 'dragging', 
                        owner: targetId,
                        startX: event.clientX,
                        startY: event.clientY,
                        currentX: event.clientX,
                        currentY: event.clientY,
                        initialOffsetX: event.target.getBoundingClientRect().left,
                        initialOffsetY: event.target.getBoundingClientRect().top
                    } 
                },
                {
                    type: 'SET_ACTIVE',
                    payload: targetId
                },
            ];
        case 'mouseup':
        case 'touchend':
        case 'touchcancel':
            const actions = [];
            if (resizingState.status.startsWith('resizing')) {
                actions.push({ type: 'SET_RESIZING', payload: { ...resizingState, status: 'idle' } });
            }
            if (draggingState.status === 'dragging') {
                actions.push({ type: 'SET_DRAGGING', payload: { ...draggingState, status: 'idle' } });
            }
            actions.push({ 
                type: 'SET_ACTIVE', 
                payload: null 
            })
            return actions;
        case 'mousemove':
        case 'touchmove':
            const { clientX: moveX, clientY: moveY } = coordinatesFromEvent(event);
            const moveActions = [];
            if (draggingState.status === 'dragging') {
                moveActions.push({ type: 'SET_DRAGGING', payload: { ...draggingState, currentX: moveX, currentY: moveY } });
            }
            if (resizingState.status.startsWith('resizing')) {
                moveActions.push({ type: 'SET_RESIZING', payload: { ...resizingState, currentX: moveX, currentY: moveY } });
            }
            return moveActions.length > 0 ? moveActions : null;
        case 'keydown':
        case 'keyup':
            return keyPressBufferFromEvent(store, event, targetId);
        case 'resize':
        case 'orientationchange':
            return { type: 'SET_VIEWPORT_SIZE', payload: { width: window.innerWidth, height: window.innerHeight } };
        default:
            return null;
    }
};

const dispatchGlobalInteraction = (event) => {
    const closestNodeElement = event.target instanceof Element ? event.target.closest('[node-id]') : null;
    const targetId = closestNodeElement ? closestNodeElement.getAttribute('node-id') : 'window';
    
    const eventType = touchToMouseMap[event.type] || event.type;
    
    const actions = actionFromEventType(eventType, interactionStore)(event);
    if (actions) {
        if (Array.isArray(actions)) {
            actions.forEach(action => {
                interactionStore.dispatch(action);
            });
        } else {
            interactionStore.dispatch(actions);
        }
    }
};

const initializeGlobalListeners = () => {
    if (globalListenersInitialized) return;

    const globalEvents = eventsFromDeviceType(deviceTypeFromUserAgent(navigator.userAgent));
    globalEvents.forEach(eventType => {
        if (['resize'].includes(eventType)) {
            window.addEventListener(eventType, dispatchGlobalInteraction, { passive: true });
        } else {
            document.addEventListener(eventType, dispatchGlobalInteraction, { passive: true });
        }
    });

    globalListenersInitialized = true;
}

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
                const ctx = interactionStore.getState();
                _litRender(renderFn({ store, element: this, ctx }), this);
            }
        }
    )
}

let globalListenersInitialized = false;
initializeGlobalListeners();

export { defineReactiveElement };
