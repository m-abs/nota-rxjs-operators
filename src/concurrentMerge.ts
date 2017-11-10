import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/defer'
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeAll'

/**
 * Run a number of concurrent tasks the data in an observable and get the results in the original order.
 */
export function concurrentMerge<T, O>(this: Observable<T>, cb: (val: T) => Observable<O> | Promise<O>, concurrent?: number): Observable<Array<O>> {
  return new Observable<O[]>((observer) => {
    const worker = this.map((val: T, index: number) => {
      return Observable.defer(() => cb(val)).map((res) => ({index, res}));
    })
    .mergeAll(concurrent);

    const output = [] as Array<O>;

    return worker.subscribe(
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
    /**
     * Run a number of concurrent tasks the data in an observable and get the results in the original order.
     */
    concurrentMerge: typeof concurrentMerge;
  }
}
