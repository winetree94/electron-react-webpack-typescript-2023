import { parentPort, workerData } from 'worker_threads';
import { change } from './search';

change(
  workerData.pathes,
  workerData.changes,
).then((res) => {
  parentPort.postMessage(res);
});

