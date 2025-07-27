interface ConfigItem {
  __state: boolean;
  readonly isEnabled: boolean;
  enable(): void;
  disable(): void;
}
interface Config {
  events: ConfigItem;
  debug: ConfigItem;
}
/**
 * @private
 * @description This is the default configuration for Cami.js
 */
declare const __config: Config;
export { __config, type Config, type ConfigItem };
//# sourceMappingURL=config.d.ts.map
