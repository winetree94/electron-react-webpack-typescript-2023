import { parentPort, workerData } from 'worker_threads';
import { getAllFilePath } from './search';

getAllFilePath(
  workerData.path,
  workerData.extensions,
  workerData.ignorePatterns,
).then((res) => {
  parentPort.postMessage(res);
});

