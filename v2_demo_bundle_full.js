// src/exp/v2/gemini/tracker.ts
class Tracker {
    contextStack = [];
    track(fn) {
        const deps = new Set();
        this.contextStack.push(deps);
        try {
            fn();
        } finally {
            this.contextStack.pop();
        }
        return deps;
    }
    recordAccess(storeId, path) {
        const activeDeps = this.contextStack[this.contextStack.length - 1];
        if (activeDeps) {
            activeDeps.add({ storeId, path });
        }
    }
}
var tracker = new Tracker();
// src/exp/v2/gemini/signals.ts
class ObserverNode {
    observers = new Set();
    children = new Map();
    parent = null;
    key = null;
    constructor(parent = null, key = null) {
        this.parent = parent;
        this.key = key;
    }
    getOrCreateChild(key) {
        let child = this.children.get(key);
        if (!child) {
            child = new ObserverNode(this, key);
            this.children.set(key, child);
        }
        return child;
    }
    removeObserver(obs) {
        this.observers.delete(obs);
        this.maybeCleanup();
    }
    maybeCleanup() {
        if (this.observers.size === 0 && this.children.size === 0) {
            if (this.parent) {
                this.parent.children.delete(this.key);
                this.parent.maybeCleanup();
            } else {
                for (const [storeId, root] of storeRoots.entries()) {
                    if (root === this) {
                        storeRoots.delete(storeId);
                        break;
                    }
                }
            }
        }
    }
}
var storeRoots = new Map();
var observerToNodes = new Map();
function getRoot(storeId) {
    let root = storeRoots.get(storeId);
    if (!root) {
        root = new ObserverNode();
        storeRoots.set(storeId, root);
    }
    return root;
}
function subscribeToPaths(invalidator, deps) {
    const oldNodes = observerToNodes.get(invalidator);
    if (oldNodes) {
        for (const node of oldNodes) {
            node.removeObserver(invalidator);
        }
    }
    const newNodes = new Set();
    for (const dep of deps) {
        let node = getRoot(dep.storeId);
        for (const segment of dep.path) {
            node = node.getOrCreateChild(segment);
        }
        node.observers.add(invalidator);
        newNodes.add(node);
    }
    observerToNodes.set(invalidator, newNodes);
}
function notifyChanged(storeId, path) {
    const affected = new Set();
    let node = storeRoots.get(storeId);
    if (node) {
        for (const obs of node.observers) affected.add(obs);
        for (const segment of path) {
            node = node.children.get(segment);
            if (!node) break;
            for (const obs of node.observers) affected.add(obs);
        }
    }
    if (node) {
        collectAllChildren(node, affected);
    }
    for (const obs of affected) {
        obs();
    }
}
function collectAllChildren(node, affected) {
    for (const child of node.children.values()) {
        for (const obs of child.observers) affected.add(obs);
        collectAllChildren(child, affected);
    }
}

class Effect {
    fn;
    invalidator;
    disposed = false;
    constructor(fn) {
        this.fn = fn;
        this.invalidator = () => {
            if (!this.disposed) {
                this.run();
            }
        };
        this.run();
    }
    run() {
        const deps = tracker.track(() => this.fn());
        subscribeToPaths(this.invalidator, deps);
    }
    dispose() {
        this.disposed = true;
        subscribeToPaths(this.invalidator, new Set());
        observerToNodes.delete(this.invalidator);
    }
}
// node_modules/immer/dist/immer.mjs
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");
var errors = [
    function (plugin) {
        return `The plugin for '${plugin}' has not been loaded into Immer. To enable the plugin, import and call \`enable${plugin}()\` when initializing your application.`;
    },
    function (thing) {
        return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${thing}'`;
    },
    "This object has been frozen and should not be mutated",
    function (data) {
        return (
            "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " +
            data
        );
    },
    "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
    "Immer forbids circular references",
    "The first or second argument to `produce` must be a function",
    "The third argument to `produce` must be a function or undefined",
    "First argument to `createDraft` must be a plain object, an array, or an immerable object",
    "First argument to `finishDraft` must be a draft returned by `createDraft`",
    function (thing) {
        return `'current' expects a draft, got: ${thing}`;
    },
    "Object.defineProperty() cannot be used on an Immer draft",
    "Object.setPrototypeOf() cannot be used on an Immer draft",
    "Immer only supports deleting array indices",
    "Immer only supports setting array indices and the 'length' property",
    function (thing) {
        return `'original' expects a draft, got: ${thing}`;
    },
];
function die(error, ...args) {
    if (true) {
        const e = errors[error];
        const msg = typeof e === "function" ? e.apply(null, args) : e;
        throw new Error(`[Immer] ${msg}`);
    }
    throw new Error(
        `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`,
    );
}
var getPrototypeOf = Object.getPrototypeOf;
function isDraft(value) {
    return !!value && !!value[DRAFT_STATE];
}
function isDraftable(value) {
    if (!value) return false;
    return (
        isPlainObject(value) ||
        Array.isArray(value) ||
        !!value[DRAFTABLE] ||
        !!value.constructor?.[DRAFTABLE] ||
        isMap(value) ||
        isSet(value)
    );
}
var objectCtorString = Object.prototype.constructor.toString();
function isPlainObject(value) {
    if (!value || typeof value !== "object") return false;
    const proto = getPrototypeOf(value);
    if (proto === null) {
        return true;
    }
    const Ctor =
        Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
    if (Ctor === Object) return true;
    return (
        typeof Ctor == "function" &&
        Function.toString.call(Ctor) === objectCtorString
    );
}
function each(obj, iter) {
    if (getArchtype(obj) === 0) {
        Reflect.ownKeys(obj).forEach((key) => {
            iter(key, obj[key], obj);
        });
    } else {
        obj.forEach((entry, index) => iter(index, entry, obj));
    }
}
function getArchtype(thing) {
    const state = thing[DRAFT_STATE];
    return state
        ? state.type_
        : Array.isArray(thing)
          ? 1
          : isMap(thing)
            ? 2
            : isSet(thing)
              ? 3
              : 0;
}
function has(thing, prop) {
    return getArchtype(thing) === 2
        ? thing.has(prop)
        : Object.prototype.hasOwnProperty.call(thing, prop);
}
function get(thing, prop) {
    return getArchtype(thing) === 2 ? thing.get(prop) : thing[prop];
}
function set(thing, propOrOldValue, value) {
    const t = getArchtype(thing);
    if (t === 2) thing.set(propOrOldValue, value);
    else if (t === 3) {
        thing.add(value);
    } else thing[propOrOldValue] = value;
}
function is(x, y) {
    if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
    } else {
        return x !== x && y !== y;
    }
}
function isMap(target) {
    return target instanceof Map;
}
function isSet(target) {
    return target instanceof Set;
}
function latest(state) {
    return state.copy_ || state.base_;
}
function shallowCopy(base, strict) {
    if (isMap(base)) {
        return new Map(base);
    }
    if (isSet(base)) {
        return new Set(base);
    }
    if (Array.isArray(base)) return Array.prototype.slice.call(base);
    const isPlain = isPlainObject(base);
    if (strict === true || (strict === "class_only" && !isPlain)) {
        const descriptors = Object.getOwnPropertyDescriptors(base);
        delete descriptors[DRAFT_STATE];
        let keys = Reflect.ownKeys(descriptors);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const desc = descriptors[key];
            if (desc.writable === false) {
                desc.writable = true;
                desc.configurable = true;
            }
            if (desc.get || desc.set)
                descriptors[key] = {
                    configurable: true,
                    writable: true,
                    enumerable: desc.enumerable,
                    value: base[key],
                };
        }
        return Object.create(getPrototypeOf(base), descriptors);
    } else {
        const proto = getPrototypeOf(base);
        if (proto !== null && isPlain) {
            return { ...base };
        }
        const obj = Object.create(proto);
        return Object.assign(obj, base);
    }
}
function freeze(obj, deep = false) {
    if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj)) return obj;
    if (getArchtype(obj) > 1) {
        obj.set =
            obj.add =
            obj.clear =
            obj.delete =
                dontMutateFrozenCollections;
    }
    Object.freeze(obj);
    if (deep)
        Object.entries(obj).forEach(([key, value]) => freeze(value, true));
    return obj;
}
function dontMutateFrozenCollections() {
    die(2);
}
function isFrozen(obj) {
    return Object.isFrozen(obj);
}
var plugins = {};
function getPlugin(pluginKey) {
    const plugin = plugins[pluginKey];
    if (!plugin) {
        die(0, pluginKey);
    }
    return plugin;
}
function loadPlugin(pluginKey, implementation) {
    if (!plugins[pluginKey]) plugins[pluginKey] = implementation;
}
var currentScope;
function getCurrentScope() {
    return currentScope;
}
function createScope(parent_, immer_) {
    return {
        drafts_: [],
        parent_,
        immer_,
        canAutoFreeze_: true,
        unfinalizedDrafts_: 0,
    };
}
function usePatchesInScope(scope, patchListener) {
    if (patchListener) {
        getPlugin("Patches");
        scope.patches_ = [];
        scope.inversePatches_ = [];
        scope.patchListener_ = patchListener;
    }
}
function revokeScope(scope) {
    leaveScope(scope);
    scope.drafts_.forEach(revokeDraft);
    scope.drafts_ = null;
}
function leaveScope(scope) {
    if (scope === currentScope) {
        currentScope = scope.parent_;
    }
}
function enterScope(immer2) {
    return (currentScope = createScope(currentScope, immer2));
}
function revokeDraft(draft) {
    const state = draft[DRAFT_STATE];
    if (state.type_ === 0 || state.type_ === 1) state.revoke_();
    else state.revoked_ = true;
}
function processResult(result, scope) {
    scope.unfinalizedDrafts_ = scope.drafts_.length;
    const baseDraft = scope.drafts_[0];
    const isReplaced = result !== undefined && result !== baseDraft;
    if (isReplaced) {
        if (baseDraft[DRAFT_STATE].modified_) {
            revokeScope(scope);
            die(4);
        }
        if (isDraftable(result)) {
            result = finalize(scope, result);
            if (!scope.parent_) maybeFreeze(scope, result);
        }
        if (scope.patches_) {
            getPlugin("Patches").generateReplacementPatches_(
                baseDraft[DRAFT_STATE].base_,
                result,
                scope.patches_,
                scope.inversePatches_,
            );
        }
    } else {
        result = finalize(scope, baseDraft, []);
    }
    revokeScope(scope);
    if (scope.patches_) {
        scope.patchListener_(scope.patches_, scope.inversePatches_);
    }
    return result !== NOTHING ? result : undefined;
}
function finalize(rootScope, value, path) {
    if (isFrozen(value)) return value;
    const state = value[DRAFT_STATE];
    if (!state) {
        each(value, (key, childValue) =>
            finalizeProperty(rootScope, state, value, key, childValue, path),
        );
        return value;
    }
    if (state.scope_ !== rootScope) return value;
    if (!state.modified_) {
        maybeFreeze(rootScope, state.base_, true);
        return state.base_;
    }
    if (!state.finalized_) {
        state.finalized_ = true;
        state.scope_.unfinalizedDrafts_--;
        const result = state.copy_;
        let resultEach = result;
        let isSet2 = false;
        if (state.type_ === 3) {
            resultEach = new Set(result);
            result.clear();
            isSet2 = true;
        }
        each(resultEach, (key, childValue) =>
            finalizeProperty(
                rootScope,
                state,
                result,
                key,
                childValue,
                path,
                isSet2,
            ),
        );
        maybeFreeze(rootScope, result, false);
        if (path && rootScope.patches_) {
            getPlugin("Patches").generatePatches_(
                state,
                path,
                rootScope.patches_,
                rootScope.inversePatches_,
            );
        }
    }
    return state.copy_;
}
function finalizeProperty(
    rootScope,
    parentState,
    targetObject,
    prop,
    childValue,
    rootPath,
    targetIsSet,
) {
    if (childValue === targetObject) die(5);
    if (isDraft(childValue)) {
        const path =
            rootPath &&
            parentState &&
            parentState.type_ !== 3 &&
            !has(parentState.assigned_, prop)
                ? rootPath.concat(prop)
                : undefined;
        const res = finalize(rootScope, childValue, path);
        set(targetObject, prop, res);
        if (isDraft(res)) {
            rootScope.canAutoFreeze_ = false;
        } else return;
    } else if (targetIsSet) {
        targetObject.add(childValue);
    }
    if (isDraftable(childValue) && !isFrozen(childValue)) {
        if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
            return;
        }
        finalize(rootScope, childValue);
        if (
            (!parentState || !parentState.scope_.parent_) &&
            typeof prop !== "symbol" &&
            Object.prototype.propertyIsEnumerable.call(targetObject, prop)
        )
            maybeFreeze(rootScope, childValue);
    }
}
function maybeFreeze(scope, value, deep = false) {
    if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
        freeze(value, deep);
    }
}
function createProxyProxy(base, parent) {
    const isArray = Array.isArray(base);
    const state = {
        type_: isArray ? 1 : 0,
        scope_: parent ? parent.scope_ : getCurrentScope(),
        modified_: false,
        finalized_: false,
        assigned_: {},
        parent_: parent,
        base_: base,
        draft_: null,
        copy_: null,
        revoke_: null,
        isManual_: false,
    };
    let target = state;
    let traps = objectTraps;
    if (isArray) {
        target = [state];
        traps = arrayTraps;
    }
    const { revoke, proxy } = Proxy.revocable(target, traps);
    state.draft_ = proxy;
    state.revoke_ = revoke;
    return proxy;
}
var objectTraps = {
    get(state, prop) {
        if (prop === DRAFT_STATE) return state;
        const source = latest(state);
        if (!has(source, prop)) {
            return readPropFromProto(state, source, prop);
        }
        const value = source[prop];
        if (state.finalized_ || !isDraftable(value)) {
            return value;
        }
        if (value === peek(state.base_, prop)) {
            prepareCopy(state);
            return (state.copy_[prop] = createProxy(value, state));
        }
        return value;
    },
    has(state, prop) {
        return prop in latest(state);
    },
    ownKeys(state) {
        return Reflect.ownKeys(latest(state));
    },
    set(state, prop, value) {
        const desc = getDescriptorFromProto(latest(state), prop);
        if (desc?.set) {
            desc.set.call(state.draft_, value);
            return true;
        }
        if (!state.modified_) {
            const current2 = peek(latest(state), prop);
            const currentState = current2?.[DRAFT_STATE];
            if (currentState && currentState.base_ === value) {
                state.copy_[prop] = value;
                state.assigned_[prop] = false;
                return true;
            }
            if (
                is(value, current2) &&
                (value !== undefined || has(state.base_, prop))
            )
                return true;
            prepareCopy(state);
            markChanged(state);
        }
        if (
            (state.copy_[prop] === value &&
                (value !== undefined || prop in state.copy_)) ||
            (Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
        )
            return true;
        state.copy_[prop] = value;
        state.assigned_[prop] = true;
        return true;
    },
    deleteProperty(state, prop) {
        if (peek(state.base_, prop) !== undefined || prop in state.base_) {
            state.assigned_[prop] = false;
            prepareCopy(state);
            markChanged(state);
        } else {
            delete state.assigned_[prop];
        }
        if (state.copy_) {
            delete state.copy_[prop];
        }
        return true;
    },
    getOwnPropertyDescriptor(state, prop) {
        const owner = latest(state);
        const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
        if (!desc) return desc;
        return {
            writable: true,
            configurable: state.type_ !== 1 || prop !== "length",
            enumerable: desc.enumerable,
            value: owner[prop],
        };
    },
    defineProperty() {
        die(11);
    },
    getPrototypeOf(state) {
        return getPrototypeOf(state.base_);
    },
    setPrototypeOf() {
        die(12);
    },
};
var arrayTraps = {};
each(objectTraps, (key, fn) => {
    arrayTraps[key] = function () {
        arguments[0] = arguments[0][0];
        return fn.apply(this, arguments);
    };
});
arrayTraps.deleteProperty = function (state, prop) {
    if (isNaN(parseInt(prop))) die(13);
    return arrayTraps.set.call(this, state, prop, undefined);
};
arrayTraps.set = function (state, prop, value) {
    if (prop !== "length" && isNaN(parseInt(prop))) die(14);
    return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
    const state = draft[DRAFT_STATE];
    const source = state ? latest(state) : draft;
    return source[prop];
}
function readPropFromProto(state, source, prop) {
    const desc = getDescriptorFromProto(source, prop);
    return desc
        ? `value` in desc
            ? desc.value
            : desc.get?.call(state.draft_)
        : undefined;
}
function getDescriptorFromProto(source, prop) {
    if (!(prop in source)) return;
    let proto = getPrototypeOf(source);
    while (proto) {
        const desc = Object.getOwnPropertyDescriptor(proto, prop);
        if (desc) return desc;
        proto = getPrototypeOf(proto);
    }
    return;
}
function markChanged(state) {
    if (!state.modified_) {
        state.modified_ = true;
        if (state.parent_) {
            markChanged(state.parent_);
        }
    }
}
function prepareCopy(state) {
    if (!state.copy_) {
        state.copy_ = shallowCopy(
            state.base_,
            state.scope_.immer_.useStrictShallowCopy_,
        );
    }
}
var Immer2 = class {
    constructor(config) {
        this.autoFreeze_ = true;
        this.useStrictShallowCopy_ = false;
        this.produce = (base, recipe, patchListener) => {
            if (typeof base === "function" && typeof recipe !== "function") {
                const defaultBase = recipe;
                recipe = base;
                const self = this;
                return function curriedProduce(base2 = defaultBase, ...args) {
                    return self.produce(base2, (draft) =>
                        recipe.call(this, draft, ...args),
                    );
                };
            }
            if (typeof recipe !== "function") die(6);
            if (
                patchListener !== undefined &&
                typeof patchListener !== "function"
            )
                die(7);
            let result;
            if (isDraftable(base)) {
                const scope = enterScope(this);
                const proxy = createProxy(base, undefined);
                let hasError = true;
                try {
                    result = recipe(proxy);
                    hasError = false;
                } finally {
                    if (hasError) revokeScope(scope);
                    else leaveScope(scope);
                }
                usePatchesInScope(scope, patchListener);
                return processResult(result, scope);
            } else if (!base || typeof base !== "object") {
                result = recipe(base);
                if (result === undefined) result = base;
                if (result === NOTHING) result = undefined;
                if (this.autoFreeze_) freeze(result, true);
                if (patchListener) {
                    const p = [];
                    const ip = [];
                    getPlugin("Patches").generateReplacementPatches_(
                        base,
                        result,
                        p,
                        ip,
                    );
                    patchListener(p, ip);
                }
                return result;
            } else die(1, base);
        };
        this.produceWithPatches = (base, recipe) => {
            if (typeof base === "function") {
                return (state, ...args) =>
                    this.produceWithPatches(state, (draft) =>
                        base(draft, ...args),
                    );
            }
            let patches, inversePatches;
            const result = this.produce(base, recipe, (p, ip) => {
                patches = p;
                inversePatches = ip;
            });
            return [result, patches, inversePatches];
        };
        if (typeof config?.autoFreeze === "boolean")
            this.setAutoFreeze(config.autoFreeze);
        if (typeof config?.useStrictShallowCopy === "boolean")
            this.setUseStrictShallowCopy(config.useStrictShallowCopy);
    }
    createDraft(base) {
        if (!isDraftable(base)) die(8);
        if (isDraft(base)) base = current(base);
        const scope = enterScope(this);
        const proxy = createProxy(base, undefined);
        proxy[DRAFT_STATE].isManual_ = true;
        leaveScope(scope);
        return proxy;
    }
    finishDraft(draft, patchListener) {
        const state = draft && draft[DRAFT_STATE];
        if (!state || !state.isManual_) die(9);
        const { scope_: scope } = state;
        usePatchesInScope(scope, patchListener);
        return processResult(undefined, scope);
    }
    setAutoFreeze(value) {
        this.autoFreeze_ = value;
    }
    setUseStrictShallowCopy(value) {
        this.useStrictShallowCopy_ = value;
    }
    applyPatches(base, patches) {
        let i;
        for (i = patches.length - 1; i >= 0; i--) {
            const patch = patches[i];
            if (patch.path.length === 0 && patch.op === "replace") {
                base = patch.value;
                break;
            }
        }
        if (i > -1) {
            patches = patches.slice(i + 1);
        }
        const applyPatchesImpl = getPlugin("Patches").applyPatches_;
        if (isDraft(base)) {
            return applyPatchesImpl(base, patches);
        }
        return this.produce(base, (draft) => applyPatchesImpl(draft, patches));
    }
};
function createProxy(value, parent) {
    const draft = isMap(value)
        ? getPlugin("MapSet").proxyMap_(value, parent)
        : isSet(value)
          ? getPlugin("MapSet").proxySet_(value, parent)
          : createProxyProxy(value, parent);
    const scope = parent ? parent.scope_ : getCurrentScope();
    scope.drafts_.push(draft);
    return draft;
}
function current(value) {
    if (!isDraft(value)) die(10, value);
    return currentImpl(value);
}
function currentImpl(value) {
    if (!isDraftable(value) || isFrozen(value)) return value;
    const state = value[DRAFT_STATE];
    let copy;
    if (state) {
        if (!state.modified_) return state.base_;
        state.finalized_ = true;
        copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
    } else {
        copy = shallowCopy(value, true);
    }
    each(copy, (key, childValue) => {
        set(copy, key, currentImpl(childValue));
    });
    if (state) {
        state.finalized_ = false;
    }
    return copy;
}
function enablePatches() {
    const errorOffset = 16;
    if (true) {
        errors.push(
            'Sets cannot have "replace" patches.',
            function (op) {
                return "Unsupported patch operation: " + op;
            },
            function (path) {
                return "Cannot apply patch, path doesn't resolve: " + path;
            },
            "Patching reserved attributes like __proto__, prototype and constructor is not allowed",
        );
    }
    const REPLACE = "replace";
    const ADD = "add";
    const REMOVE = "remove";
    function generatePatches_(state, basePath, patches, inversePatches) {
        switch (state.type_) {
            case 0:
            case 2:
                return generatePatchesFromAssigned(
                    state,
                    basePath,
                    patches,
                    inversePatches,
                );
            case 1:
                return generateArrayPatches(
                    state,
                    basePath,
                    patches,
                    inversePatches,
                );
            case 3:
                return generateSetPatches(
                    state,
                    basePath,
                    patches,
                    inversePatches,
                );
        }
    }
    function generateArrayPatches(state, basePath, patches, inversePatches) {
        let { base_, assigned_ } = state;
        let copy_ = state.copy_;
        if (copy_.length < base_.length) {
            [base_, copy_] = [copy_, base_];
            [patches, inversePatches] = [inversePatches, patches];
        }
        for (let i = 0; i < base_.length; i++) {
            if (assigned_[i] && copy_[i] !== base_[i]) {
                const path = basePath.concat([i]);
                patches.push({
                    op: REPLACE,
                    path,
                    value: clonePatchValueIfNeeded(copy_[i]),
                });
                inversePatches.push({
                    op: REPLACE,
                    path,
                    value: clonePatchValueIfNeeded(base_[i]),
                });
            }
        }
        for (let i = base_.length; i < copy_.length; i++) {
            const path = basePath.concat([i]);
            patches.push({
                op: ADD,
                path,
                value: clonePatchValueIfNeeded(copy_[i]),
            });
        }
        for (let i = copy_.length - 1; base_.length <= i; --i) {
            const path = basePath.concat([i]);
            inversePatches.push({
                op: REMOVE,
                path,
            });
        }
    }
    function generatePatchesFromAssigned(
        state,
        basePath,
        patches,
        inversePatches,
    ) {
        const { base_, copy_ } = state;
        each(state.assigned_, (key, assignedValue) => {
            const origValue = get(base_, key);
            const value = get(copy_, key);
            const op = !assignedValue
                ? REMOVE
                : has(base_, key)
                  ? REPLACE
                  : ADD;
            if (origValue === value && op === REPLACE) return;
            const path = basePath.concat(key);
            patches.push(op === REMOVE ? { op, path } : { op, path, value });
            inversePatches.push(
                op === ADD
                    ? { op: REMOVE, path }
                    : op === REMOVE
                      ? {
                            op: ADD,
                            path,
                            value: clonePatchValueIfNeeded(origValue),
                        }
                      : {
                            op: REPLACE,
                            path,
                            value: clonePatchValueIfNeeded(origValue),
                        },
            );
        });
    }
    function generateSetPatches(state, basePath, patches, inversePatches) {
        let { base_, copy_ } = state;
        let i = 0;
        base_.forEach((value) => {
            if (!copy_.has(value)) {
                const path = basePath.concat([i]);
                patches.push({
                    op: REMOVE,
                    path,
                    value,
                });
                inversePatches.unshift({
                    op: ADD,
                    path,
                    value,
                });
            }
            i++;
        });
        i = 0;
        copy_.forEach((value) => {
            if (!base_.has(value)) {
                const path = basePath.concat([i]);
                patches.push({
                    op: ADD,
                    path,
                    value,
                });
                inversePatches.unshift({
                    op: REMOVE,
                    path,
                    value,
                });
            }
            i++;
        });
    }
    function generateReplacementPatches_(
        baseValue,
        replacement,
        patches,
        inversePatches,
    ) {
        patches.push({
            op: REPLACE,
            path: [],
            value: replacement === NOTHING ? undefined : replacement,
        });
        inversePatches.push({
            op: REPLACE,
            path: [],
            value: baseValue,
        });
    }
    function applyPatches_(draft, patches) {
        patches.forEach((patch) => {
            const { path, op } = patch;
            let base = draft;
            for (let i = 0; i < path.length - 1; i++) {
                const parentType = getArchtype(base);
                let p = path[i];
                if (typeof p !== "string" && typeof p !== "number") {
                    p = "" + p;
                }
                if (
                    (parentType === 0 || parentType === 1) &&
                    (p === "__proto__" || p === "constructor")
                )
                    die(errorOffset + 3);
                if (typeof base === "function" && p === "prototype")
                    die(errorOffset + 3);
                base = get(base, p);
                if (typeof base !== "object")
                    die(errorOffset + 2, path.join("/"));
            }
            const type = getArchtype(base);
            const value = deepClonePatchValue(patch.value);
            const key = path[path.length - 1];
            switch (op) {
                case REPLACE:
                    switch (type) {
                        case 2:
                            return base.set(key, value);
                        case 3:
                            die(errorOffset);
                        default:
                            return (base[key] = value);
                    }
                case ADD:
                    switch (type) {
                        case 1:
                            return key === "-"
                                ? base.push(value)
                                : base.splice(key, 0, value);
                        case 2:
                            return base.set(key, value);
                        case 3:
                            return base.add(value);
                        default:
                            return (base[key] = value);
                    }
                case REMOVE:
                    switch (type) {
                        case 1:
                            return base.splice(key, 1);
                        case 2:
                            return base.delete(key);
                        case 3:
                            return base.delete(patch.value);
                        default:
                            return delete base[key];
                    }
                default:
                    die(errorOffset + 1, op);
            }
        });
        return draft;
    }
    function deepClonePatchValue(obj) {
        if (!isDraftable(obj)) return obj;
        if (Array.isArray(obj)) return obj.map(deepClonePatchValue);
        if (isMap(obj))
            return new Map(
                Array.from(obj.entries()).map(([k, v]) => [
                    k,
                    deepClonePatchValue(v),
                ]),
            );
        if (isSet(obj))
            return new Set(Array.from(obj).map(deepClonePatchValue));
        const cloned = Object.create(getPrototypeOf(obj));
        for (const key in obj) cloned[key] = deepClonePatchValue(obj[key]);
        if (has(obj, DRAFTABLE)) cloned[DRAFTABLE] = obj[DRAFTABLE];
        return cloned;
    }
    function clonePatchValueIfNeeded(obj) {
        if (isDraft(obj)) {
            return deepClonePatchValue(obj);
        } else return obj;
    }
    loadPlugin("Patches", {
        applyPatches_,
        generatePatches_,
        generateReplacementPatches_,
    });
}
function enableMapSet() {
    class DraftMap extends Map {
        constructor(target, parent) {
            super();
            this[DRAFT_STATE] = {
                type_: 2,
                parent_: parent,
                scope_: parent ? parent.scope_ : getCurrentScope(),
                modified_: false,
                finalized_: false,
                copy_: undefined,
                assigned_: undefined,
                base_: target,
                draft_: this,
                isManual_: false,
                revoked_: false,
            };
        }
        get size() {
            return latest(this[DRAFT_STATE]).size;
        }
        has(key) {
            return latest(this[DRAFT_STATE]).has(key);
        }
        set(key, value) {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            if (!latest(state).has(key) || latest(state).get(key) !== value) {
                prepareMapCopy(state);
                markChanged(state);
                state.assigned_.set(key, true);
                state.copy_.set(key, value);
                state.assigned_.set(key, true);
            }
            return this;
        }
        delete(key) {
            if (!this.has(key)) {
                return false;
            }
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            prepareMapCopy(state);
            markChanged(state);
            if (state.base_.has(key)) {
                state.assigned_.set(key, false);
            } else {
                state.assigned_.delete(key);
            }
            state.copy_.delete(key);
            return true;
        }
        clear() {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            if (latest(state).size) {
                prepareMapCopy(state);
                markChanged(state);
                state.assigned_ = /* @__PURE__ */ new Map();
                each(state.base_, (key) => {
                    state.assigned_.set(key, false);
                });
                state.copy_.clear();
            }
        }
        forEach(cb, thisArg) {
            const state = this[DRAFT_STATE];
            latest(state).forEach((_value, key, _map) => {
                cb.call(thisArg, this.get(key), key, this);
            });
        }
        get(key) {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            const value = latest(state).get(key);
            if (state.finalized_ || !isDraftable(value)) {
                return value;
            }
            if (value !== state.base_.get(key)) {
                return value;
            }
            const draft = createProxy(value, state);
            prepareMapCopy(state);
            state.copy_.set(key, draft);
            return draft;
        }
        keys() {
            return latest(this[DRAFT_STATE]).keys();
        }
        values() {
            const iterator = this.keys();
            return {
                [Symbol.iterator]: () => this.values(),
                next: () => {
                    const r = iterator.next();
                    if (r.done) return r;
                    const value = this.get(r.value);
                    return {
                        done: false,
                        value,
                    };
                },
            };
        }
        entries() {
            const iterator = this.keys();
            return {
                [Symbol.iterator]: () => this.entries(),
                next: () => {
                    const r = iterator.next();
                    if (r.done) return r;
                    const value = this.get(r.value);
                    return {
                        done: false,
                        value: [r.value, value],
                    };
                },
            };
        }
        [(DRAFT_STATE, Symbol.iterator)]() {
            return this.entries();
        }
    }
    function proxyMap_(target, parent) {
        return new DraftMap(target, parent);
    }
    function prepareMapCopy(state) {
        if (!state.copy_) {
            state.assigned_ = /* @__PURE__ */ new Map();
            state.copy_ = new Map(state.base_);
        }
    }

    class DraftSet extends Set {
        constructor(target, parent) {
            super();
            this[DRAFT_STATE] = {
                type_: 3,
                parent_: parent,
                scope_: parent ? parent.scope_ : getCurrentScope(),
                modified_: false,
                finalized_: false,
                copy_: undefined,
                base_: target,
                draft_: this,
                drafts_: /* @__PURE__ */ new Map(),
                revoked_: false,
                isManual_: false,
            };
        }
        get size() {
            return latest(this[DRAFT_STATE]).size;
        }
        has(value) {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            if (!state.copy_) {
                return state.base_.has(value);
            }
            if (state.copy_.has(value)) return true;
            if (
                state.drafts_.has(value) &&
                state.copy_.has(state.drafts_.get(value))
            )
                return true;
            return false;
        }
        add(value) {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            if (!this.has(value)) {
                prepareSetCopy(state);
                markChanged(state);
                state.copy_.add(value);
            }
            return this;
        }
        delete(value) {
            if (!this.has(value)) {
                return false;
            }
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            prepareSetCopy(state);
            markChanged(state);
            return (
                state.copy_.delete(value) ||
                (state.drafts_.has(value)
                    ? state.copy_.delete(state.drafts_.get(value))
                    : false)
            );
        }
        clear() {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            if (latest(state).size) {
                prepareSetCopy(state);
                markChanged(state);
                state.copy_.clear();
            }
        }
        values() {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            prepareSetCopy(state);
            return state.copy_.values();
        }
        entries() {
            const state = this[DRAFT_STATE];
            assertUnrevoked(state);
            prepareSetCopy(state);
            return state.copy_.entries();
        }
        keys() {
            return this.values();
        }
        [(DRAFT_STATE, Symbol.iterator)]() {
            return this.values();
        }
        forEach(cb, thisArg) {
            const iterator = this.values();
            let result = iterator.next();
            while (!result.done) {
                cb.call(thisArg, result.value, result.value, this);
                result = iterator.next();
            }
        }
    }
    function proxySet_(target, parent) {
        return new DraftSet(target, parent);
    }
    function prepareSetCopy(state) {
        if (!state.copy_) {
            state.copy_ = /* @__PURE__ */ new Set();
            state.base_.forEach((value) => {
                if (isDraftable(value)) {
                    const draft = createProxy(value, state);
                    state.drafts_.set(value, draft);
                    state.copy_.add(draft);
                } else {
                    state.copy_.add(value);
                }
            });
        }
    }
    function assertUnrevoked(state) {
        if (state.revoked_) die(3, JSON.stringify(latest(state)));
    }
    loadPlugin("MapSet", { proxyMap_, proxySet_ });
}
var immer = new Immer2();
var produce = immer.produce;
var produceWithPatches = immer.produceWithPatches.bind(immer);
var setAutoFreeze = immer.setAutoFreeze.bind(immer);
var setUseStrictShallowCopy = immer.setUseStrictShallowCopy.bind(immer);
var applyPatches = immer.applyPatches.bind(immer);
var createDraft = immer.createDraft.bind(immer);
var finishDraft = immer.finishDraft.bind(immer);

// src/exp/v2/gemini/store.ts
enablePatches();
enableMapSet();
var IS_PROXY = Symbol("isProxy");

class Store {
    _state;
    _refs;
    _storeId;
    _proxy;
    _queries = new Map();
    _reactionEffects = [];
    _resources = {};
    constructor(config) {
        this._state = config.state;
        this._refs = config.refs || {};
        this._storeId =
            config.storeId ||
            `store-${Math.random().toString(36).substring(2)}`;
        this._proxy = this._createProxy(this._state, []);
        if (config.reactions) {
            for (const reaction of config.reactions) {
                this._reactionEffects.push(
                    new Effect(() => reaction(this.state)),
                );
            }
        }
        if (config.resources) {
            this._resources = config.resources;
            for (const resource of Object.values(this._resources)) {
                if (resource.onConnect) {
                    resource.onConnect(this);
                }
            }
        }
    }
    get state() {
        return this._proxy;
    }
    get refs() {
        return this._refs;
    }
    get storeId() {
        return this._storeId;
    }
    update(recipe) {
        let capturedPatches = [];
        const nextState = produce(this._state, recipe, (patches) => {
            capturedPatches = patches;
        });
        this._state = nextState;
        this._proxy = this._createProxy(this._state, []);
        this._notifyPatches(capturedPatches);
    }
    _updateWithInverse(recipe) {
        let inverse = [];
        let capturedPatches = [];
        const nextState = produce(
            this._state,
            recipe,
            (patches, inversePatches) => {
                capturedPatches = patches;
                inverse = inversePatches;
            },
        );
        this._state = nextState;
        this._proxy = this._createProxy(this._state, []);
        this._notifyPatches(capturedPatches);
        return inverse;
    }
    _applyInversePatches(patches) {
        const nextState = applyPatches(this._state, patches);
        this._state = nextState;
        this._proxy = this._createProxy(this._state, []);
        this._notifyPatches(patches);
    }
    _notifyPatches(patches) {
        for (const patch of patches) {
            notifyChanged(this._storeId, patch.path);
        }
    }
    dispose() {
        for (const effect of this._reactionEffects) {
            effect.dispose();
        }
        this._reactionEffects = [];
        for (const resource of Object.values(this._resources)) {
            if (resource.onDisconnect) {
                resource.onDisconnect(this);
            }
        }
    }
    async mutate(mutationFn, options) {
        let inversePatches = [];
        if (options.onMutate) {
            inversePatches = this._updateWithInverse((draft) =>
                options.onMutate(draft, options.variables),
            );
        }
        try {
            const data = await mutationFn(options.variables);
            if (options.onSuccess) {
                this.update((draft) =>
                    options.onSuccess(data, draft, options.variables),
                );
            }
            return data;
        } catch (error) {
            if (inversePatches.length > 0) {
                this._applyInversePatches(inversePatches);
            }
            if (options.onError) {
                this.update((draft) =>
                    options.onError(error, draft, options.variables),
                );
            }
            throw error;
        }
    }
    async query(path, queryFn, options = {}) {
        const queryKey = JSON.stringify(path);
        const now = Date.now();
        const existing = this._queries.get(queryKey);
        if (
            existing &&
            (options.staleTime === undefined ||
                now - existing.lastUpdated < options.staleTime)
        ) {
            return existing.promise;
        }
        const promise = queryFn()
            .then((data) => {
                this.update((draft) => {
                    let current2 = draft;
                    for (let i = 0; i < path.length - 1; i++) {
                        current2 = current2[path[i]];
                    }
                    current2[path[path.length - 1]] = data;
                });
                return data;
            })
            .catch((error) => {
                this._queries.delete(queryKey);
                throw error;
            });
        this._queries.set(queryKey, { promise, lastUpdated: now });
        return promise;
    }
    _createProxy(target, path) {
        if (target === null || typeof target !== "object") return target;
        if (target[IS_PROXY]) return target;
        const storeId = this._storeId;
        const store = this;
        const handler = {
            get(t, prop, receiver) {
                if (prop === IS_PROXY) return true;
                const value = Reflect.get(t, prop, receiver);
                let segment = prop;
                if (Array.isArray(t) && typeof prop === "string") {
                    const index = Number(prop);
                    if (!Number.isNaN(index)) segment = index;
                }
                const newPath = [...path, segment];
                tracker.recordAccess(storeId, newPath);
                if (value !== null && typeof value === "object") {
                    return store._createProxy(value, newPath);
                }
                return value;
            },
            set() {
                throw new Error(
                    `[Cami] Cannot mutate store state directly. Use store.update() instead.`,
                );
            },
            deleteProperty() {
                throw new Error(
                    `[Cami] Cannot mutate store state directly. Use store.update() instead.`,
                );
            },
            defineProperty() {
                throw new Error(
                    `[Cami] Cannot mutate store state directly. Use store.update() instead.`,
                );
            },
        };
        if (target instanceof Map || target instanceof Set) {
            return new Proxy(target, {
                ...handler,
                get(t, prop, receiver) {
                    if (prop === IS_PROXY) return true;
                    const value = Reflect.get(t, prop, t);
                    if (typeof value === "function") {
                        return (...args) => {
                            const name = prop;
                            if (name === "get" || name === "has") {
                                const key = args[0];
                                const newPath = [...path, key];
                                tracker.recordAccess(storeId, newPath);
                                const result = value.apply(t, args);
                                return store._createProxy(result, newPath);
                            }
                            if (
                                [
                                    "size",
                                    "keys",
                                    "values",
                                    "entries",
                                    "forEach",
                                    Symbol.iterator,
                                ].includes(name)
                            ) {
                                tracker.recordAccess(storeId, path);
                            }
                            if (
                                ["set", "add", "delete", "clear"].includes(name)
                            ) {
                                throw new Error(
                                    `[Cami] Cannot mutate Map/Set in store state directly. Use store.update() instead.`,
                                );
                            }
                            return value.apply(t, args);
                        };
                    }
                    if (prop === "size") {
                        tracker.recordAccess(storeId, path);
                    }
                    return value;
                },
            });
        }
        const shadow = Array.isArray(target)
            ? []
            : Object.create(Object.getPrototypeOf(target));
        return new Proxy(shadow, {
            ...handler,
            get(t, prop, receiver) {
                return handler.get(target, prop, receiver);
            },
            has(t, prop) {
                return Reflect.has(target, prop);
            },
            ownKeys(t) {
                return Reflect.ownKeys(target);
            },
            getOwnPropertyDescriptor(t, prop) {
                const desc = Object.getOwnPropertyDescriptor(target, prop);
                if (desc) {
                    desc.configurable = true;
                }
                return desc;
            },
        });
    }
}
function createStore(config) {
    const store = new Store({
        state: config.state,
        refs: config.refs,
        storeId: config.storeId,
        reactions: config.reactions,
        resources: config.resources,
    });
    const actions = config.actions || {};
    const storeWithActions = store;
    for (const [name, action] of Object.entries(actions)) {
        storeWithActions[name] = (...args) => {
            store.update((draft) => action(draft, ...args));
        };
    }
    return storeWithActions;
}
// node_modules/lit-html/development/lit-html.js
var DEV_MODE = true;
var ENABLE_EXTRA_SECURITY_HOOKS = true;
var ENABLE_SHADYDOM_NOPATCH = true;
var NODE_MODE = false;
var global = globalThis;
var debugLogEvent = DEV_MODE
    ? (event) => {
          const shouldEmit = global.emitLitDebugLogEvents;
          if (!shouldEmit) {
              return;
          }
          global.dispatchEvent(
              new CustomEvent("lit-debug", {
                  detail: event,
              }),
          );
      }
    : undefined;
var debugLogRenderId = 0;
var issueWarning;
if (DEV_MODE) {
    global.litIssuedWarnings ??= new Set();
    issueWarning = (code, warning) => {
        warning += code
            ? ` See https://lit.dev/msg/${code} for more information.`
            : "";
        if (
            !global.litIssuedWarnings.has(warning) &&
            !global.litIssuedWarnings.has(code)
        ) {
            console.warn(warning);
            global.litIssuedWarnings.add(warning);
        }
    };
    queueMicrotask(() => {
        issueWarning(
            "dev-mode",
            `Lit is in dev mode. Not recommended for production!`,
        );
    });
}
var wrap =
    ENABLE_SHADYDOM_NOPATCH &&
    global.ShadyDOM?.inUse &&
    global.ShadyDOM?.noPatch === true
        ? global.ShadyDOM.wrap
        : (node) => node;
var trustedTypes = global.trustedTypes;
var policy = trustedTypes
    ? trustedTypes.createPolicy("lit-html", {
          createHTML: (s) => s,
      })
    : undefined;
var identityFunction = (value) => value;
var noopSanitizer = (_node, _name, _type) => identityFunction;
var setSanitizer = (newSanitizer) => {
    if (!ENABLE_EXTRA_SECURITY_HOOKS) {
        return;
    }
    if (sanitizerFactoryInternal !== noopSanitizer) {
        throw new Error(
            `Attempted to overwrite existing lit-html security policy.` +
                ` setSanitizeDOMValueFactory should be called at most once.`,
        );
    }
    sanitizerFactoryInternal = newSanitizer;
};
var _testOnlyClearSanitizerFactoryDoNotCallOrElse = () => {
    sanitizerFactoryInternal = noopSanitizer;
};
var createSanitizer = (node, name, type) => {
    return sanitizerFactoryInternal(node, name, type);
};
var boundAttributeSuffix = "$lit$";
var marker = `lit$${Math.random().toFixed(9).slice(2)}$`;
var markerMatch = "?" + marker;
var nodeMarker = `<${markerMatch}>`;
var d =
    NODE_MODE && global.document === undefined
        ? {
              createTreeWalker() {
                  return {};
              },
          }
        : document;
var createMarker = () => d.createComment("");
var isPrimitive = (value) =>
    value === null || (typeof value != "object" && typeof value != "function");
var isArray = Array.isArray;
var isIterable = (value) =>
    isArray(value) || typeof value?.[Symbol.iterator] === "function";
var SPACE_CHAR = `[ 	
\f\r]`;
var ATTR_VALUE_CHAR = `[^ 	
\f\r"'\`<>=]`;
var NAME_CHAR = `[^\\s"'>=/]`;
var textEndRegex = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var COMMENT_START = 1;
var TAG_NAME = 2;
var DYNAMIC_TAG_NAME = 3;
var commentEndRegex = /-->/g;
var comment2EndRegex = />/g;
var tagEndRegex = new RegExp(
    `>|${SPACE_CHAR}(?:(${NAME_CHAR}+)(${SPACE_CHAR}*=${SPACE_CHAR}*(?:${ATTR_VALUE_CHAR}|("|')|))|$)`,
    "g",
);
var ENTIRE_MATCH = 0;
var ATTRIBUTE_NAME = 1;
var SPACES_AND_EQUALS = 2;
var QUOTE_CHAR = 3;
var singleQuoteAttrEndRegex = /'/g;
var doubleQuoteAttrEndRegex = /"/g;
var rawTextElement = /^(?:script|style|textarea|title)$/i;
var HTML_RESULT = 1;
var SVG_RESULT = 2;
var MATHML_RESULT = 3;
var ATTRIBUTE_PART = 1;
var CHILD_PART = 2;
var PROPERTY_PART = 3;
var BOOLEAN_ATTRIBUTE_PART = 4;
var EVENT_PART = 5;
var ELEMENT_PART = 6;
var COMMENT_PART = 7;
var tag =
    (type) =>
    (strings, ...values) => {
        if (DEV_MODE && strings.some((s) => s === undefined)) {
            console.warn(
                `Some template strings are undefined.
` + "This is probably caused by illegal octal escape sequences.",
            );
        }
        if (DEV_MODE) {
            if (values.some((val) => val?.["_$litStatic$"])) {
                issueWarning(
                    "",
                    `Static values 'literal' or 'unsafeStatic' cannot be used as values to non-static templates.
` +
                        `Please use the static 'html' tag function. See https://lit.dev/docs/templates/expressions/#static-expressions`,
                );
            }
        }
        return {
            ["_$litType$"]: type,
            strings,
            values,
        };
    };
var html = tag(HTML_RESULT);
var svg = tag(SVG_RESULT);
var mathml = tag(MATHML_RESULT);
var noChange = Symbol.for("lit-noChange");
var nothing = Symbol.for("lit-nothing");
var templateCache = new WeakMap();
var walker = d.createTreeWalker(d, 129);
var sanitizerFactoryInternal = noopSanitizer;
function trustFromTemplateString(tsa, stringFromTSA) {
    if (!isArray(tsa) || !tsa.hasOwnProperty("raw")) {
        let message = "invalid template strings array";
        if (DEV_MODE) {
            message = `
          Internal Error: expected template strings to be an array
          with a 'raw' field. Faking a template strings array by
          calling html or svg like an ordinary function is effectively
          the same as calling unsafeHtml and can lead to major security
          issues, e.g. opening your code up to XSS attacks.
          If you're using the html or svg tagged template functions normally
          and still seeing this error, please file a bug at
          https://github.com/lit/lit/issues/new?template=bug_report.md
          and include information about your build tooling, if any.
        `
                .trim()
                .replace(
                    /\n */g,
                    `
`,
                );
        }
        throw new Error(message);
    }
    return policy !== undefined
        ? policy.createHTML(stringFromTSA)
        : stringFromTSA;
}
var getTemplateHtml = (strings, type) => {
    const l = strings.length - 1;
    const attrNames = [];
    let html2 =
        type === SVG_RESULT ? "<svg>" : type === MATHML_RESULT ? "<math>" : "";
    let rawTextEndRegex;
    let regex = textEndRegex;
    for (let i = 0; i < l; i++) {
        const s = strings[i];
        let attrNameEndIndex = -1;
        let attrName;
        let lastIndex = 0;
        let match;
        while (lastIndex < s.length) {
            regex.lastIndex = lastIndex;
            match = regex.exec(s);
            if (match === null) {
                break;
            }
            lastIndex = regex.lastIndex;
            if (regex === textEndRegex) {
                if (match[COMMENT_START] === "!--") {
                    regex = commentEndRegex;
                } else if (match[COMMENT_START] !== undefined) {
                    regex = comment2EndRegex;
                } else if (match[TAG_NAME] !== undefined) {
                    if (rawTextElement.test(match[TAG_NAME])) {
                        rawTextEndRegex = new RegExp(
                            `</${match[TAG_NAME]}`,
                            "g",
                        );
                    }
                    regex = tagEndRegex;
                } else if (match[DYNAMIC_TAG_NAME] !== undefined) {
                    if (DEV_MODE) {
                        throw new Error(
                            "Bindings in tag names are not supported. Please use static templates instead. " +
                                "See https://lit.dev/docs/templates/expressions/#static-expressions",
                        );
                    }
                    regex = tagEndRegex;
                }
            } else if (regex === tagEndRegex) {
                if (match[ENTIRE_MATCH] === ">") {
                    regex = rawTextEndRegex ?? textEndRegex;
                    attrNameEndIndex = -1;
                } else if (match[ATTRIBUTE_NAME] === undefined) {
                    attrNameEndIndex = -2;
                } else {
                    attrNameEndIndex =
                        regex.lastIndex - match[SPACES_AND_EQUALS].length;
                    attrName = match[ATTRIBUTE_NAME];
                    regex =
                        match[QUOTE_CHAR] === undefined
                            ? tagEndRegex
                            : match[QUOTE_CHAR] === '"'
                              ? doubleQuoteAttrEndRegex
                              : singleQuoteAttrEndRegex;
                }
            } else if (
                regex === doubleQuoteAttrEndRegex ||
                regex === singleQuoteAttrEndRegex
            ) {
                regex = tagEndRegex;
            } else if (
                regex === commentEndRegex ||
                regex === comment2EndRegex
            ) {
                regex = textEndRegex;
            } else {
                regex = tagEndRegex;
                rawTextEndRegex = undefined;
            }
        }
        if (DEV_MODE) {
            console.assert(
                attrNameEndIndex === -1 ||
                    regex === tagEndRegex ||
                    regex === singleQuoteAttrEndRegex ||
                    regex === doubleQuoteAttrEndRegex,
                "unexpected parse state B",
            );
        }
        const end =
            regex === tagEndRegex && strings[i + 1].startsWith("/>") ? " " : "";
        html2 +=
            regex === textEndRegex
                ? s + nodeMarker
                : attrNameEndIndex >= 0
                  ? (attrNames.push(attrName),
                    s.slice(0, attrNameEndIndex) +
                        boundAttributeSuffix +
                        s.slice(attrNameEndIndex)) +
                    marker +
                    end
                  : s + marker + (attrNameEndIndex === -2 ? i : end);
    }
    const htmlResult =
        html2 +
        (strings[l] || "<?>") +
        (type === SVG_RESULT
            ? "</svg>"
            : type === MATHML_RESULT
              ? "</math>"
              : "");
    return [trustFromTemplateString(strings, htmlResult), attrNames];
};

class Template {
    constructor({ strings, ["_$litType$"]: type }, options) {
        this.parts = [];
        let node;
        let nodeIndex = 0;
        let attrNameIndex = 0;
        const partCount = strings.length - 1;
        const parts = this.parts;
        const [html2, attrNames] = getTemplateHtml(strings, type);
        this.el = Template.createElement(html2, options);
        walker.currentNode = this.el.content;
        if (type === SVG_RESULT || type === MATHML_RESULT) {
            const wrapper = this.el.content.firstChild;
            wrapper.replaceWith(...wrapper.childNodes);
        }
        while (
            (node = walker.nextNode()) !== null &&
            parts.length < partCount
        ) {
            if (node.nodeType === 1) {
                if (DEV_MODE) {
                    const tag2 = node.localName;
                    if (
                        /^(?:textarea|template)$/i.test(tag2) &&
                        node.innerHTML.includes(marker)
                    ) {
                        const m =
                            `Expressions are not supported inside \`${tag2}\` ` +
                            `elements. See https://lit.dev/msg/expression-in-${tag2} for more ` +
                            `information.`;
                        if (tag2 === "template") {
                            throw new Error(m);
                        } else issueWarning("", m);
                    }
                }
                if (node.hasAttributes()) {
                    for (const name of node.getAttributeNames()) {
                        if (name.endsWith(boundAttributeSuffix)) {
                            const realName = attrNames[attrNameIndex++];
                            const value = node.getAttribute(name);
                            const statics = value.split(marker);
                            const m = /([.?@])?(.*)/.exec(realName);
                            parts.push({
                                type: ATTRIBUTE_PART,
                                index: nodeIndex,
                                name: m[2],
                                strings: statics,
                                ctor:
                                    m[1] === "."
                                        ? PropertyPart
                                        : m[1] === "?"
                                          ? BooleanAttributePart
                                          : m[1] === "@"
                                            ? EventPart
                                            : AttributePart,
                            });
                            node.removeAttribute(name);
                        } else if (name.startsWith(marker)) {
                            parts.push({
                                type: ELEMENT_PART,
                                index: nodeIndex,
                            });
                            node.removeAttribute(name);
                        }
                    }
                }
                if (rawTextElement.test(node.tagName)) {
                    const strings2 = node.textContent.split(marker);
                    const lastIndex = strings2.length - 1;
                    if (lastIndex > 0) {
                        node.textContent = trustedTypes
                            ? trustedTypes.emptyScript
                            : "";
                        for (let i = 0; i < lastIndex; i++) {
                            node.append(strings2[i], createMarker());
                            walker.nextNode();
                            parts.push({
                                type: CHILD_PART,
                                index: ++nodeIndex,
                            });
                        }
                        node.append(strings2[lastIndex], createMarker());
                    }
                }
            } else if (node.nodeType === 8) {
                const data = node.data;
                if (data === markerMatch) {
                    parts.push({ type: CHILD_PART, index: nodeIndex });
                } else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                        parts.push({ type: COMMENT_PART, index: nodeIndex });
                        i += marker.length - 1;
                    }
                }
            }
            nodeIndex++;
        }
        if (DEV_MODE) {
            if (attrNames.length !== attrNameIndex) {
                throw new Error(
                    `Detected duplicate attribute bindings. This occurs if your template ` +
                        `has duplicate attributes on an element tag. For example ` +
                        `"<input ?disabled=\${true} ?disabled=\${false}>" contains a ` +
                        `duplicate "disabled" attribute. The error was detected in ` +
                        `the following template: 
` +
                        "`" +
                        strings.join("${...}") +
                        "`",
                );
            }
        }
        debugLogEvent &&
            debugLogEvent({
                kind: "template prep",
                template: this,
                clonableTemplate: this.el,
                parts: this.parts,
                strings,
            });
    }
    static createElement(html2, _options) {
        const el = d.createElement("template");
        el.innerHTML = html2;
        return el;
    }
}
function resolveDirective(part, value, parent = part, attributeIndex) {
    if (value === noChange) {
        return value;
    }
    let currentDirective =
        attributeIndex !== undefined
            ? parent.__directives?.[attributeIndex]
            : parent.__directive;
    const nextDirectiveConstructor = isPrimitive(value)
        ? undefined
        : value["_$litDirective$"];
    if (currentDirective?.constructor !== nextDirectiveConstructor) {
        currentDirective?.["_$notifyDirectiveConnectionChanged"]?.(false);
        if (nextDirectiveConstructor === undefined) {
            currentDirective = undefined;
        } else {
            currentDirective = new nextDirectiveConstructor(part);
            currentDirective._$initialize(part, parent, attributeIndex);
        }
        if (attributeIndex !== undefined) {
            (parent.__directives ??= [])[attributeIndex] = currentDirective;
        } else {
            parent.__directive = currentDirective;
        }
    }
    if (currentDirective !== undefined) {
        value = resolveDirective(
            part,
            currentDirective._$resolve(part, value.values),
            currentDirective,
            attributeIndex,
        );
    }
    return value;
}

class TemplateInstance {
    constructor(template, parent) {
        this._$parts = [];
        this._$disconnectableChildren = undefined;
        this._$template = template;
        this._$parent = parent;
    }
    get parentNode() {
        return this._$parent.parentNode;
    }
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    _clone(options) {
        const {
            el: { content },
            parts,
        } = this._$template;
        const fragment = (options?.creationScope ?? d).importNode(
            content,
            true,
        );
        walker.currentNode = fragment;
        let node = walker.nextNode();
        let nodeIndex = 0;
        let partIndex = 0;
        let templatePart = parts[0];
        while (templatePart !== undefined) {
            if (nodeIndex === templatePart.index) {
                let part;
                if (templatePart.type === CHILD_PART) {
                    part = new ChildPart(node, node.nextSibling, this, options);
                } else if (templatePart.type === ATTRIBUTE_PART) {
                    part = new templatePart.ctor(
                        node,
                        templatePart.name,
                        templatePart.strings,
                        this,
                        options,
                    );
                } else if (templatePart.type === ELEMENT_PART) {
                    part = new ElementPart(node, this, options);
                }
                this._$parts.push(part);
                templatePart = parts[++partIndex];
            }
            if (nodeIndex !== templatePart?.index) {
                node = walker.nextNode();
                nodeIndex++;
            }
        }
        walker.currentNode = d;
        return fragment;
    }
    _update(values) {
        let i = 0;
        for (const part of this._$parts) {
            if (part !== undefined) {
                debugLogEvent &&
                    debugLogEvent({
                        kind: "set part",
                        part,
                        value: values[i],
                        valueIndex: i,
                        values,
                        templateInstance: this,
                    });
                if (part.strings !== undefined) {
                    part._$setValue(values, part, i);
                    i += part.strings.length - 2;
                } else {
                    part._$setValue(values[i]);
                }
            }
            i++;
        }
    }
}

class ChildPart {
    get _$isConnected() {
        return this._$parent?._$isConnected ?? this.__isConnected;
    }
    constructor(startNode, endNode, parent, options) {
        this.type = CHILD_PART;
        this._$committedValue = nothing;
        this._$disconnectableChildren = undefined;
        this._$startNode = startNode;
        this._$endNode = endNode;
        this._$parent = parent;
        this.options = options;
        this.__isConnected = options?.isConnected ?? true;
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            this._textSanitizer = undefined;
        }
    }
    get parentNode() {
        let parentNode = wrap(this._$startNode).parentNode;
        const parent = this._$parent;
        if (parent !== undefined && parentNode?.nodeType === 11) {
            parentNode = parent.parentNode;
        }
        return parentNode;
    }
    get startNode() {
        return this._$startNode;
    }
    get endNode() {
        return this._$endNode;
    }
    _$setValue(value, directiveParent = this) {
        if (DEV_MODE && this.parentNode === null) {
            throw new Error(
                `This \`ChildPart\` has no \`parentNode\` and therefore cannot accept a value. This likely means the element containing the part was manipulated in an unsupported way outside of Lit's control such that the part's marker nodes were ejected from DOM. For example, setting the element's \`innerHTML\` or \`textContent\` can do this.`,
            );
        }
        value = resolveDirective(this, value, directiveParent);
        if (isPrimitive(value)) {
            if (value === nothing || value == null || value === "") {
                if (this._$committedValue !== nothing) {
                    debugLogEvent &&
                        debugLogEvent({
                            kind: "commit nothing to child",
                            start: this._$startNode,
                            end: this._$endNode,
                            parent: this._$parent,
                            options: this.options,
                        });
                    this._$clear();
                }
                this._$committedValue = nothing;
            } else if (value !== this._$committedValue && value !== noChange) {
                this._commitText(value);
            }
        } else if (value["_$litType$"] !== undefined) {
            this._commitTemplateResult(value);
        } else if (value.nodeType !== undefined) {
            if (DEV_MODE && this.options?.host === value) {
                this._commitText(
                    `[probable mistake: rendered a template's host in itself ` +
                        `(commonly caused by writing \${this} in a template]`,
                );
                console.warn(
                    `Attempted to render the template host`,
                    value,
                    `inside itself. This is almost always a mistake, and in dev mode `,
                    `we render some warning text. In production however, we'll `,
                    `render it, which will usually result in an error, and sometimes `,
                    `in the element disappearing from the DOM.`,
                );
                return;
            }
            this._commitNode(value);
        } else if (isIterable(value)) {
            this._commitIterable(value);
        } else {
            this._commitText(value);
        }
    }
    _insert(node) {
        return wrap(wrap(this._$startNode).parentNode).insertBefore(
            node,
            this._$endNode,
        );
    }
    _commitNode(value) {
        if (this._$committedValue !== value) {
            this._$clear();
            if (
                ENABLE_EXTRA_SECURITY_HOOKS &&
                sanitizerFactoryInternal !== noopSanitizer
            ) {
                const parentNodeName = this._$startNode.parentNode?.nodeName;
                if (parentNodeName === "STYLE" || parentNodeName === "SCRIPT") {
                    let message = "Forbidden";
                    if (DEV_MODE) {
                        if (parentNodeName === "STYLE") {
                            message =
                                `Lit does not support binding inside style nodes. ` +
                                `This is a security risk, as style injection attacks can ` +
                                `exfiltrate data and spoof UIs. ` +
                                `Consider instead using css\`...\` literals ` +
                                `to compose styles, and do dynamic styling with ` +
                                `css custom properties, ::parts, <slot>s, ` +
                                `and by mutating the DOM rather than stylesheets.`;
                        } else {
                            message =
                                `Lit does not support binding inside script nodes. ` +
                                `This is a security risk, as it could allow arbitrary ` +
                                `code execution.`;
                        }
                    }
                    throw new Error(message);
                }
            }
            debugLogEvent &&
                debugLogEvent({
                    kind: "commit node",
                    start: this._$startNode,
                    parent: this._$parent,
                    value,
                    options: this.options,
                });
            this._$committedValue = this._insert(value);
        }
    }
    _commitText(value) {
        if (
            this._$committedValue !== nothing &&
            isPrimitive(this._$committedValue)
        ) {
            const node = wrap(this._$startNode).nextSibling;
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(
                        node,
                        "data",
                        "property",
                    );
                }
                value = this._textSanitizer(value);
            }
            debugLogEvent &&
                debugLogEvent({
                    kind: "commit text",
                    node,
                    value,
                    options: this.options,
                });
            node.data = value;
        } else {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                const textNode = d.createTextNode("");
                this._commitNode(textNode);
                if (this._textSanitizer === undefined) {
                    this._textSanitizer = createSanitizer(
                        textNode,
                        "data",
                        "property",
                    );
                }
                value = this._textSanitizer(value);
                debugLogEvent &&
                    debugLogEvent({
                        kind: "commit text",
                        node: textNode,
                        value,
                        options: this.options,
                    });
                textNode.data = value;
            } else {
                this._commitNode(d.createTextNode(value));
                debugLogEvent &&
                    debugLogEvent({
                        kind: "commit text",
                        node: wrap(this._$startNode).nextSibling,
                        value,
                        options: this.options,
                    });
            }
        }
        this._$committedValue = value;
    }
    _commitTemplateResult(result) {
        const { values, ["_$litType$"]: type } = result;
        const template =
            typeof type === "number"
                ? this._$getTemplate(result)
                : (type.el === undefined &&
                      (type.el = Template.createElement(
                          trustFromTemplateString(type.h, type.h[0]),
                          this.options,
                      )),
                  type);
        if (this._$committedValue?._$template === template) {
            debugLogEvent &&
                debugLogEvent({
                    kind: "template updating",
                    template,
                    instance: this._$committedValue,
                    parts: this._$committedValue._$parts,
                    options: this.options,
                    values,
                });
            this._$committedValue._update(values);
        } else {
            const instance = new TemplateInstance(template, this);
            const fragment = instance._clone(this.options);
            debugLogEvent &&
                debugLogEvent({
                    kind: "template instantiated",
                    template,
                    instance,
                    parts: instance._$parts,
                    options: this.options,
                    fragment,
                    values,
                });
            instance._update(values);
            debugLogEvent &&
                debugLogEvent({
                    kind: "template instantiated and updated",
                    template,
                    instance,
                    parts: instance._$parts,
                    options: this.options,
                    fragment,
                    values,
                });
            this._commitNode(fragment);
            this._$committedValue = instance;
        }
    }
    _$getTemplate(result) {
        let template = templateCache.get(result.strings);
        if (template === undefined) {
            templateCache.set(
                result.strings,
                (template = new Template(result)),
            );
        }
        return template;
    }
    _commitIterable(value) {
        if (!isArray(this._$committedValue)) {
            this._$committedValue = [];
            this._$clear();
        }
        const itemParts = this._$committedValue;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            if (partIndex === itemParts.length) {
                itemParts.push(
                    (itemPart = new ChildPart(
                        this._insert(createMarker()),
                        this._insert(createMarker()),
                        this,
                        this.options,
                    )),
                );
            } else {
                itemPart = itemParts[partIndex];
            }
            itemPart._$setValue(item);
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            this._$clear(
                itemPart && wrap(itemPart._$endNode).nextSibling,
                partIndex,
            );
            itemParts.length = partIndex;
        }
    }
    _$clear(start = wrap(this._$startNode).nextSibling, from) {
        this._$notifyConnectionChanged?.(false, true, from);
        while (start && start !== this._$endNode) {
            const n = wrap(start).nextSibling;
            wrap(start).remove();
            start = n;
        }
    }
    setConnected(isConnected) {
        if (this._$parent === undefined) {
            this.__isConnected = isConnected;
            this._$notifyConnectionChanged?.(isConnected);
        } else if (DEV_MODE) {
            throw new Error(
                "part.setConnected() may only be called on a " +
                    "RootPart returned from render().",
            );
        }
    }
}

class AttributePart {
    get tagName() {
        return this.element.tagName;
    }
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    constructor(element, name, strings, parent, options) {
        this.type = ATTRIBUTE_PART;
        this._$committedValue = nothing;
        this._$disconnectableChildren = undefined;
        this.element = element;
        this.name = name;
        this._$parent = parent;
        this.options = options;
        if (strings.length > 2 || strings[0] !== "" || strings[1] !== "") {
            this._$committedValue = new Array(strings.length - 1).fill(
                new String(),
            );
            this.strings = strings;
        } else {
            this._$committedValue = nothing;
        }
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            this._sanitizer = undefined;
        }
    }
    _$setValue(value, directiveParent = this, valueIndex, noCommit) {
        const strings = this.strings;
        let change = false;
        if (strings === undefined) {
            value = resolveDirective(this, value, directiveParent, 0);
            change =
                !isPrimitive(value) ||
                (value !== this._$committedValue && value !== noChange);
            if (change) {
                this._$committedValue = value;
            }
        } else {
            const values = value;
            value = strings[0];
            let i, v;
            for (i = 0; i < strings.length - 1; i++) {
                v = resolveDirective(
                    this,
                    values[valueIndex + i],
                    directiveParent,
                    i,
                );
                if (v === noChange) {
                    v = this._$committedValue[i];
                }
                change ||= !isPrimitive(v) || v !== this._$committedValue[i];
                if (v === nothing) {
                    value = nothing;
                } else if (value !== nothing) {
                    value += (v ?? "") + strings[i + 1];
                }
                this._$committedValue[i] = v;
            }
        }
        if (change && !noCommit) {
            this._commitValue(value);
        }
    }
    _commitValue(value) {
        if (value === nothing) {
            wrap(this.element).removeAttribute(this.name);
        } else {
            if (ENABLE_EXTRA_SECURITY_HOOKS) {
                if (this._sanitizer === undefined) {
                    this._sanitizer = sanitizerFactoryInternal(
                        this.element,
                        this.name,
                        "attribute",
                    );
                }
                value = this._sanitizer(value ?? "");
            }
            debugLogEvent &&
                debugLogEvent({
                    kind: "commit attribute",
                    element: this.element,
                    name: this.name,
                    value,
                    options: this.options,
                });
            wrap(this.element).setAttribute(this.name, value ?? "");
        }
    }
}

class PropertyPart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = PROPERTY_PART;
    }
    _commitValue(value) {
        if (ENABLE_EXTRA_SECURITY_HOOKS) {
            if (this._sanitizer === undefined) {
                this._sanitizer = sanitizerFactoryInternal(
                    this.element,
                    this.name,
                    "property",
                );
            }
            value = this._sanitizer(value);
        }
        debugLogEvent &&
            debugLogEvent({
                kind: "commit property",
                element: this.element,
                name: this.name,
                value,
                options: this.options,
            });
        this.element[this.name] = value === nothing ? undefined : value;
    }
}

class BooleanAttributePart extends AttributePart {
    constructor() {
        super(...arguments);
        this.type = BOOLEAN_ATTRIBUTE_PART;
    }
    _commitValue(value) {
        debugLogEvent &&
            debugLogEvent({
                kind: "commit boolean attribute",
                element: this.element,
                name: this.name,
                value: !!(value && value !== nothing),
                options: this.options,
            });
        wrap(this.element).toggleAttribute(
            this.name,
            !!value && value !== nothing,
        );
    }
}

class EventPart extends AttributePart {
    constructor(element, name, strings, parent, options) {
        super(element, name, strings, parent, options);
        this.type = EVENT_PART;
        if (DEV_MODE && this.strings !== undefined) {
            throw new Error(
                `A \`<${element.localName}>\` has a \`@${name}=...\` listener with ` +
                    "invalid content. Event listeners in templates must have exactly " +
                    "one expression and no surrounding text.",
            );
        }
    }
    _$setValue(newListener, directiveParent = this) {
        newListener =
            resolveDirective(this, newListener, directiveParent, 0) ?? nothing;
        if (newListener === noChange) {
            return;
        }
        const oldListener = this._$committedValue;
        const shouldRemoveListener =
            (newListener === nothing && oldListener !== nothing) ||
            newListener.capture !== oldListener.capture ||
            newListener.once !== oldListener.once ||
            newListener.passive !== oldListener.passive;
        const shouldAddListener =
            newListener !== nothing &&
            (oldListener === nothing || shouldRemoveListener);
        debugLogEvent &&
            debugLogEvent({
                kind: "commit event listener",
                element: this.element,
                name: this.name,
                value: newListener,
                options: this.options,
                removeListener: shouldRemoveListener,
                addListener: shouldAddListener,
                oldListener,
            });
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.name, this, oldListener);
        }
        if (shouldAddListener) {
            this.element.addEventListener(this.name, this, newListener);
        }
        this._$committedValue = newListener;
    }
    handleEvent(event) {
        if (typeof this._$committedValue === "function") {
            this._$committedValue.call(
                this.options?.host ?? this.element,
                event,
            );
        } else {
            this._$committedValue.handleEvent(event);
        }
    }
}

class ElementPart {
    constructor(element, parent, options) {
        this.element = element;
        this.type = ELEMENT_PART;
        this._$disconnectableChildren = undefined;
        this._$parent = parent;
        this.options = options;
    }
    get _$isConnected() {
        return this._$parent._$isConnected;
    }
    _$setValue(value) {
        debugLogEvent &&
            debugLogEvent({
                kind: "commit to element binding",
                element: this.element,
                value,
                options: this.options,
            });
        resolveDirective(this, value);
    }
}
var polyfillSupport = DEV_MODE
    ? global.litHtmlPolyfillSupportDevMode
    : global.litHtmlPolyfillSupport;
polyfillSupport?.(Template, ChildPart);
(global.litHtmlVersions ??= []).push("3.3.0");
if (DEV_MODE && global.litHtmlVersions.length > 1) {
    queueMicrotask(() => {
        issueWarning(
            "multiple-versions",
            `Multiple versions of Lit loaded. ` +
                `Loading multiple versions is not recommended.`,
        );
    });
}
var render = (value, container, options) => {
    if (DEV_MODE && container == null) {
        throw new TypeError(
            `The container to render into may not be ${container}`,
        );
    }
    const renderId = DEV_MODE ? debugLogRenderId++ : 0;
    const partOwnerNode = options?.renderBefore ?? container;
    let part = partOwnerNode["_$litPart$"];
    debugLogEvent &&
        debugLogEvent({
            kind: "begin render",
            id: renderId,
            value,
            container,
            options,
            part,
        });
    if (part === undefined) {
        const endNode = options?.renderBefore ?? null;
        partOwnerNode["_$litPart$"] = part = new ChildPart(
            container.insertBefore(createMarker(), endNode),
            endNode,
            undefined,
            options ?? {},
        );
    }
    part._$setValue(value);
    debugLogEvent &&
        debugLogEvent({
            kind: "end render",
            id: renderId,
            value,
            container,
            options,
            part,
        });
    return part;
};
if (ENABLE_EXTRA_SECURITY_HOOKS) {
    render.setSanitizer = setSanitizer;
    render.createSanitizer = createSanitizer;
    if (DEV_MODE) {
        render._testOnlyClearSanitizerFactoryDoNotCallOrElse =
            _testOnlyClearSanitizerFactoryDoNotCallOrElse;
    }
}

// src/exp/v2/gemini/element.ts
class CamiElement extends HTMLElement {
    _effect = null;
    _root;
    constructor() {
        super();
        this._root = this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this._effect = new Effect(() => {
            const template = this.view();
            if (template) {
                render(template, this._root);
            }
        });
    }
    disconnectedCallback() {
        if (this._effect) {
            this._effect.dispose();
            this._effect = null;
        }
    }
    view() {
        return html``;
    }
}
// src/exp/v2/gemini/selector.ts
function defineSelector(fn) {
    let memoizedValue;
    let isDirty = true;
    let deps = new Set();
    const invalidator = () => {
        isDirty = true;
    };
    const selector = () => {
        for (const dep of deps) {
            tracker.recordAccess(dep.storeId, dep.path);
        }
        if (isDirty) {
            const newDeps = tracker.track(() => {
                memoizedValue = fn();
            });
            subscribeToPaths(invalidator, newDeps);
            deps = newDeps;
            isDirty = false;
            for (const dep of newDeps) {
                tracker.recordAccess(dep.storeId, dep.path);
            }
        }
        return memoizedValue;
    };
    return selector;
}

// src/exp/v2/gemini/index.ts
function mount(container, element) {
    const target =
        typeof container === "string"
            ? document.querySelector(container)
            : container;
    if (!target) {
        throw new Error(`[Cami] Mount target not found: ${container}`);
    }
    let el;
    if (typeof element === "function") {
        let tagName =
            element.name ||
            `cami-el-${Math.random().toString(36).substring(2, 7)}`;
        tagName = tagName.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
        if (!tagName.includes("-")) {
            tagName = `cami-${tagName}`;
        }
        if (!customElements.get(tagName)) {
            customElements.define(tagName, element);
        }
        el = document.createElement(tagName);
    } else {
        el = element;
    }
    target.appendChild(el);
    return el;
}
export {
    tracker,
    subscribeToPaths,
    notifyChanged,
    mount,
    defineSelector,
    createStore,
    Store,
    Effect,
    CamiElement,
};
