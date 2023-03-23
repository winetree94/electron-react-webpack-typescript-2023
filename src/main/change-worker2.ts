import { parentPort, workerData } from 'worker_threads';
import { change2 } from './search';

change2(
  workerData.pathes,
  workerData.changes,
).then((res) => {
  parentPort.postMessage(res);
});

