
## Defining a preset

A preset is defined with the following functions.

Everything is optional; use only what you need.

```typescript
module.exports = {
    /**
     * Provide some default configuration along with the preset.
     *
     * @return A partial configuration, that will be recursively merged in the existing configuration
     */
    defaultConfig(): {[key: string]: string} { return {} }

    /**
     * Finalize the configuration once the user overrides have been applied.
     *
     * (things like renaming legacy parameters, validating or sanitizing values can be done here)
     *
     * @param config The original configuration
     * @return The full configuration
     */
    config(config: {[key: string]: string}): {[key: string]: string} { return config; }

    /**
     * Prepares the commands that can be invoked in this preset.
     *
     * @param crafty The Crafty instance
     * @return an object with command names as key, and an object with "command" and "description" as keys
     */
    commands(crafty: Crafty): {[command: string]: {command: (crafty: Crafty, input: string, cli: Meow) => Promise<number>, description: string}} { return {} }

    /**
     * This extension point is called when the configuration is complete, you can use this if you need to initialize something that will be needed later by your preset
     *
     * @param crafty The Crafty instance
     */
    init(crafty: Crafty): void

    /**
     * This extension point allows to transform a bundle into a task, any preset can define one or more bundle creators
     *
     * @param crafty The Crafty instance
     */
    bundleCreator(crafty: Crafty): {
      [bundleType: string]: {
        [runnerName: string]: (crafty: Crafty, bundle: Bundle) => void
      }
    }

    /**
     * This extension point is called when tasks will be executed (listing, running or watching).
     * Use it to declare your tasks and watchers that aren't related to bundles.
     *
     * @param crafty The Crafty instance
     */
    tasks(crafty: Crafty): void

    /**
     * This extension point is called when `crafty test` is executed, you can run your test runner at this time and return with a Promise.
     *
     * @param crafty The Crafty instance
     * @param input The input to the command
     * @param cli The Meow instance, allows to query for options and parameters
     * @returns a promise that fail if the test fail.
     */
    test(crafty: Crafty, input: string, cli: Meow): Promise

    // Presets add more extensions points

    // babel
    // jest
    // gulp
    // rollup
    // webpack
}
```

## Defining a bundleCreator

Bundles can contain those fields by default, each bundleType can add more fields.

```typescript
interface Bundle {

    /**
     * The bundle name, is the key you specify next to the object in `crafty.config.js`
     */
    name: string;

    /**
     * The bundle's type, generally `js` or `css`, you can also create your own types.
     */
    type: string;

    /**
     * The task name to use when you generate the task, is made of `<bundle.type>_<bundle.name>`
     */
    taskName: string;

    /**
     * One single file or an array of files you wish to compile. Glob expressions are valid.
     */
    source: string | string[];

    /*
     * The name to give to the final file. Defaults to `<bundle_name>.min.<bundle_type>`
     */
    destintion: string;

    /*
     * The name of the runner to use for this bundle. Is mandatory if more than one runner is loaded
     */
    runner?: string;

    /*
     * The watch expression to use to rebuild this asset.
     * Any glob expression is valid, is needed for Gulp in watch mode.
     * Webpack and rollup.js have their own mechanism to watch files and don't need this option.
     * If nothing is specified, it will use the value of `source` as a watch expression
     */
    watch?: string | string[];
}
```

A bundle creator is a function that receives a crafty instance and a bundle, and is supposed to create a task and a watcher.

An example :

```typescript
bundleCreator(crafty: crafty): {
    js: {
        "gulp/babel": (crafty: Crafty, bundle: Bundle) => {
            crafty.undertaker.task(bundle.taskName, () => {
                // Run your task
                Promise.resolve();
            }));
            crafty.watcher.add(bundle.watch || bundle.source, bundle.taskName);
        }
    }
}
```

In this example, you can see that this bundleCreator is meant for the `js` bundleType, and will be used if you specify `gulp` or `gulp/babel` as runner.

You can also see that a watcher is created, so if the `bundle.watch` pattern is matched, `bundle.taskName` is executed.

## Defining a command

Commands receive three parameters: a Crafty instance, the command input and the parsed arguments used in the CLI.

```typescript
/**
 * @param crafty The Crafty instance
 * @param input The input to the command
 * @param cli The Meow instance, allows to query for options and parameters
 * @returns a promise that resolves with 0 if everything went well or rejects with a non 0 exit code
 */
function command(crafty: Crafty, input: string, cli: Meow): Promise<number> {
    return Promise.resolve(0);
}
```

## The Crafty instance

The Crafty instance that is passed around contains all the configuration, commands and tasks generated.

[Check out it's API](The_Crafty_instance.md)