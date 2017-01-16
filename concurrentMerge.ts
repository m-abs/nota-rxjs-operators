import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/defer'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeAll'

export function concurrentMerge<T>(this: Observable<T>, cb: (val: T) => Observable<T> | Promise<T>, concurrent?: number): Observable<T> {
  return Observable.create((observer) => {
    const worker = this.map((val: T, index: number) => {
      return Observable.defer(() => cb(val)).map((res) => ({index, res}));
    })
    .mergeAll(concurrent);

    const output: T[] = [];

    worker.subscribe(
      ({index, res}) => {
        output[index] = res;
      },
      (err) => Observable.throw(err),
      () => {
        Observable.of(output).subscribe(observer);
      });
  });
}

Observable.prototype.concurrentMerge = concurrentMerge;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    concurrentMerge: typeof concurrentMerge;
  }
}
