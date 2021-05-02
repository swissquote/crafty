# Profiling

## Using speedscope

https://github.com/jlfwong/speedscope/wiki/Importing-from-Node.js

```bash
cd packages/experiment
yarn node --prof ../crafty/src/bin.js run
node --prof-process --preprocess -j isolate*.log | speedscope -
```

## Using Google Chrome

```bash
cd packages/integration/fixtures/crafty-preset-swc-g/lints-es5
node --inspect-brk ../../../../crafty/src/bin.js run
```

- open `about:inspect` in Google Chrome
- Find your instance, click "inspect"
- Go to "Profiler" Tab
- Click "Start"
- Wait for the process to finish
- Click "Stop"
