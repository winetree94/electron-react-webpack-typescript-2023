import { parentPort, workerData } from 'worker_threads';
import { search } from './search';

search(
  workerData.pathes,
  workerData.keywords,
).then((res) => {
  parentPort.postMessage(res);
});

