/**
 * This is a simplifed version of synckit
 * https://www.npmjs.com/package/synckit
 * All credit goes to the original authors
 */

"use strict";

const path = require("node:path");
const node_url = require("node:url");
const node_worker_threads = require("node:worker_threads");

const INT32_BYTES = 4;

let syncFnCache;

function extractProperties(object) {
  if (object && typeof object === "object") {
    const properties = {};

    for (const key in object) {
      properties[key] = object[key];
    }

    return properties;
  }
}

function createSyncFn(workerPath, timeoutOrOptions) {
  if (!syncFnCache) {
    syncFnCache = new Map();
  }

  const cachedSyncFn = syncFnCache.get(workerPath);

  if (cachedSyncFn) {
    return cachedSyncFn;
  }

  if (!path.isAbsolute(workerPath)) {
    throw new Error("`workerPath` must be absolute");
  }

  const syncFn = startWorkerThread(
    workerPath,

    /* istanbul ignore next */

    typeof timeoutOrOptions === "number"
      ? { timeout: timeoutOrOptions }
      : timeoutOrOptions
  );

  syncFnCache.set(workerPath, syncFn);

  return syncFn;
}

let sharedBuffer;
let sharedBufferView;

function startWorkerThread(
  workerPath,
  { timeout, execArgv = [], transferList = [] } = {}
) {
  const { port1: mainPort, port2: workerPort } =
    new node_worker_threads.MessageChannel();

  const workerPathUrl = node_url.pathToFileURL(workerPath);

  if (!sharedBuffer) {
    sharedBuffer = new SharedArrayBuffer(INT32_BYTES);
  }

  if (!sharedBufferView) {
    sharedBufferView = new Int32Array(sharedBuffer, 0, 1);
  }

  const worker = new node_worker_threads.Worker(workerPathUrl, {
    workerData: { sharedBuffer, workerPort },
    transferList: [workerPort, ...transferList],
    execArgv,
  });

  let nextID = 0;

  const syncFn = (...args) => {
    const id = nextID++;
    const msg = { id, args };

    worker.postMessage(msg);
    const status = Atomics.wait(sharedBufferView, 0, 0, timeout);

    Atomics.store(sharedBufferView, 0, 0);

    if (!["ok", "not-equal"].includes(status)) {
      throw new Error("Internal error: Atomics.wait() failed: " + status);
    }

    const {
      id: id2,
      result,
      error,
      properties,
    } = node_worker_threads.receiveMessageOnPort(mainPort).message;

    if (id !== id2) {
      throw new Error(`Internal error: Expected id ${id} but got id ${id2}`);
    }

    if (error) {
      throw Object.assign(error, properties);
    }

    return result;
  };

  worker.unref();

  return syncFn;
}

function runAsWorker(fn) {
  if (!node_worker_threads.workerData) {
    return;
  }

  const { workerPort, sharedBuffer } = node_worker_threads.workerData;

  const sharedBufferView = new Int32Array(sharedBuffer, 0, 1);

  node_worker_threads.parentPort.on("message", ({ id, args }) => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      let msg;
      try {
        msg = { id, result: await fn(...args) };
      } catch (error) {
        msg = { id, error, properties: extractProperties(error) };
      }
      workerPort.postMessage(msg);
      Atomics.add(sharedBufferView, 0, 1);
      Atomics.notify(sharedBufferView, 0);
    })();
  });
}

exports.createSyncFn = createSyncFn;
exports.runAsWorker = runAsWorker;
