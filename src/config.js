/**
 * @private
 * @type {Object}
 * @property {boolean} events - A flag to control event firing
 * @description This is the default configuration for Cami.js
 */
const __config = {
  events: {
    __state: true,
    get isEnabled() { return this.__state; },
    enable: function() { this.__state = true; },
    disable: function() { this.__state = false; }
  },
  debug: {
    __state: false,
    get isEnabled() { return this.__state; },
    enable: function() {
      console.log('Cami.js debug mode enabled');
      this.__state = true;
    },
    disable: function() { this.__state = false; }
  }
};

export { __config };
