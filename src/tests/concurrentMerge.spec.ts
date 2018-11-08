import { defer, Observable, of, throwError } from 'rxjs';
import { concurrentMerge } from '../concurrentMerge';

let workerNo = 0;
function makePromise(val: number) {
  const delay = Math.random() * 1000 * val;
  const workerId = (workerNo += 1);
  return new Promise<number>((resolve, reject) => {
    setTimeout(() => {
      console.log({
        workerId,
        delay,
        val,
      });
      resolve(val * 2);
    }, delay);
  });
}

of(1, 2, 3, 4, 5)
  .pipe(concurrentMerge((val) => makePromise(val)))
  .subscribe(
    (vals) => {
      console.log(vals);
    },
    (err) => {
      console.log(err);
    },
  );
