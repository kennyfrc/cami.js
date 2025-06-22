/**
 * @private
 * @description This is the default configuration for Cami.js
 */
const __config = {
    events: {
        __state: true,
        get isEnabled() {
            return this.__state;
        },
        enable: function () {
            this.__state = true;
        },
        disable: function () {
            this.__state = false;
        },
    },
    debug: {
        __state: false,
        get isEnabled() {
            return this.__state;
        },
        enable: function () {
            console.log("Cami.js debug mode enabled");
            this.__state = true;
        },
        disable: function () {
            this.__state = false;
        },
    },
};
export { __config };
//# sourceMappingURL=config.js.map