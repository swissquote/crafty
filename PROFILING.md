# Profiling

https://github.com/jlfwong/speedscope/wiki/Importing-from-Node.js

```bash
yarn node --prof ../crafty/src/bin.js run
node --prof-process --preprocess -j isolate*.log | speedscope -
```