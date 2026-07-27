interface ConfigItem {
  __state: boolean
  readonly isEnabled: boolean
  enable(): void
  disable(): void
}

interface Config {
  events: ConfigItem
  debug: ConfigItem
}

/**
 * @private
 * @description This is the default configuration for Cami.js
 */
const __config: Config = {
  events: {
    __state: true,
    get isEnabled(): boolean {
      return this.__state
    },
    enable: function (this: ConfigItem): void {
      this.__state = true
    },
    disable: function (this: ConfigItem): void {
      this.__state = false
    },
  },
  debug: {
    __state: false,
    get isEnabled(): boolean {
      return this.__state
    },
    enable: function (this: ConfigItem): void {
      console.log('Cami.js debug mode enabled')
      this.__state = true
    },
    disable: function (this: ConfigItem): void {
      this.__state = false
    },
  },
}

export { __config, type Config, type ConfigItem }
