/**
 * @constant
 * @type {Object}
 * @property {boolean} events - A flag to control event firing
 * @description This is the default configuration for Cami.js
 */
const _config = {
  events: {
    _state: true,
    get isEnabled() { return this._state; },
    enable: function() { this._state = true; },
    disable: function() { this._state = false; }
  },
  debug: {
    _state: false,
    get isEnabled() { return this._state; },
    enable: function() {
      console.log('Cami.js debug mode enabled');
      this._state = true;
    },
    disable: function() { this._state = false; }
  }
};

export { _config };
