
[TOC]

## Crafty

```typescript
class Crafty {

    /**
     *  Crafty's configuration object. All presets can add their values to it.
     */
    config: {};

    /**
     * Log information, with a timestamp.
     * See below for more
     */
    log: FancyLog

    /**
     * Task repository, taken from Gulp 4
     * See below for more
     */
    undertaker: Undertaker;

    /**
     * Add watchers
     * See below for more
     */
    watcher: Watcher;

    /**
     * Format and log an error.
     */
    error(error: Error) {}

    /**
     * Add a task to the default run, will then be executed on `crafty run default` or `crafty run`
     */
    addDefaultTask(task: string) {}

    /**
     * Are we in watch mode right now ?
     * If the parameter is specified, will enable or disable watch mode.
     */
    isWatching(enable?: boolean) {}

    /**
     * Get the current environment
     */
    getEnvironment() {}

    /**
     * Get the implementations of a method from all presets
     */
    getImplementations(method: string) {}

    /**
     * Get the current loglevel
     *
     * 1: normal
     * 2: verbose
     * 3: debug
     */
   get loglevel()

    /**
     * Load the tasks
     */
   createTasks()
}
```

## Logging

```typescript
class FancyLog {
    (...msg: any): void,
    error: (...msg: any) => void,
    warn: (...msg: any) => void,
    info: (...msg: any) => void,
    dir: (...msg: any) => void,
}
```

```typescript
crafty.log("Some", "logging", "message")
crafty.log.info("You should know this");
```

[Official documentation](https://www.npmjs.com/package/fancy-log)

## Undertaker: the task repository

```typescript
crafty.undertaker.task('task1', () => {
  return new Promise((resolve, reject) => {
    resolve(); // when everything is done
  });
});

crafty.undertaker.task('combined', crafty.undertaker.series('task1', 'task1'));
crafty.undertaker.task('all', crafty.undertaker.parallel('combined', 'task1'));
```

[Official documentation](https://www.npmjs.com/package/undertaker)

## Watcher

```typescript
class Watcher {
   add(regex: RegExp, task: string) {}

   addRaw(runner: {start: () => void}) {}

   run() {}
}
```