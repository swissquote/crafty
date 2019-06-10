PostCSS' API isn't well suited to configure which extensions should be executed or not, this task is left to the final user.

But Crafty has a bundle of PostCSS plugins that have their own configuration.

With this API, we try to provide a rich API that allows you to add, remove, reconfigure and reorder plugins.
Even better, we provide some ways to conditionally enable plugins.

## Extending from your `crafty.config.js`

For this you need to add a `postcss` method to your `crafty.config.js`

```javascript
module.exports = {
  /**
   * Represents the extension point for Postcss configuration
   * @param {Crafty} crafty - The instance of Crafty.
   * @param {ProcessorMap} config - The list of configured plugins
   */
  postcss(crafty, config) {
    // Add postcss-fixes
    // We recommend that for all plugins you add, you set a "before",
    // because otherwise they run as last plugins and some other plugins might miss some optimizations
    // For example if your plugin adds a `calc()` or a `var()` postcss-calc and postcss-custom-properties will already have run
    config.processor("postcss-fixes").before("autoprefixer");

    // Replace postcss-csso with cssnano,
    // - enabled in production, disabled otherwise
    // - runs before postcss-reporter
    // - use cssnano's default preset
    config.delete("postcss-csso");
    config
      .processor("cssnano")
      .enableIf(options => crafty.getEnvironment() === "production")
      .before("postcss-reporter")
      .setOptions({
        preset: "default"
      });

    // Change autoprefixer's options to disable autoprefixing for flexbox
    const autoprefixerOptions = config.processor("autoprefixer").options;
    autoprefixerOptions.flexbox = false;

    // Override CSS custom properties in code
    const customProperties = config.processor("postcss-custom-properties")
      .options;
    customProperties.variables = {
      color: "#fa5b35"
    };
  }
};
```

## `ProcessorMap`

The main object allows you add or remove elements from the map

```typescript
class ProcessorMap {
  /**
   * Allows you to add or change a processor,
   * The name will be used to load the plugin if nothing else is specified.
   */
  processor(moduleName: string): Processor;

  /**
   * Remove all entries
   */
  clear(): ProcessorMap;

  /**
   * Delete a single processor
   * @param name The processor to remove
   */
  delete(name: string): ProcessorMap;

  /**
   * Check if a processor is configured
   */
  has(name: string): boolean;

  /**
   * An array of all the values in the map, sorted.
   */
  values(): Processor[];

  /*
   * Returns an object of all the entries in the backing Map
   * where the key is the object property, and the value
   * corresponding to the key. Will return `undefined` if the backing
   * Map is empty.
   * This will order properties by their name if the value is
   * a ProcessorMap that used .before() or .after().
   */

  entries(): { [name: string]: Processor };
}
```

## `Processor`

```typescript
class <OPTIONS> Processor<OPTIONS = Object> {
  constructor(name: string);

  options: OPTIONS

  /**
   * Same as the constructor parameter, allows you to change
   * which module will be loaded for this processor.
   */
  module(moduleName: string): Processor;

  /**
   * Provide a custom init callback, needed if your plugin
   * is a function or needs more than one parameter.
   * This is an alternative to `.module(name)`.
   *
   * .init(options => require("my-postcss-plugin")(options))
   *
   * @param fun The function that will return the instance of the plugin
   */
  init(fun: (options: OPTIONS): PluginInstance): Processor;

  /**
   * Returns a boolean to tell if the processor is enabled or not.
   *
   * @param fun
   */
  enableIf(fun: (options: OPTIONS): boolean): Processor;

  /**
   * Enables the plugin if the spec it implements isn't
   * supported by all browsers that are targeted
   *
   * @param caniuseFeature The name of the CSS spec that it implements
   * @param browsers the list of browsers that target
   */
  enableIfUnsupported(caniuseFeature: string|string[], browsers: string): Processor;

  /**
   * Change all the options at once.
   *
   * @param {Object} options The new options object
   */
  setOptions(options: OPTIONS): Processor;

  /**
   * Specify before which plugin this plugin has to run.
   * Must not be set at the same time as ".after()"
   *
   * @param {string} name The name of the plugin before which we must run
   */
  before(name): Processor;

  /**
   * Specify after which plugin this plugin has to run.
   * Must not be set at the same time as ".before()"
   *
   * @param {string} name The name of the plugin before which we must run
   */
  after(name): Processor;
}
```

## Examples

### Add a new processor after another one
