import {
  defer,
  Observable,
  of,
  throwError as observableThrowError,
} from 'rxjs';
import { map, mergeAll } from 'rxjs/operators';

/**
 * Run a number of concurrent tasks the data in an observable and get the results in the original order.
 */
export const concurrentMerge = <O>(
  cb: (val: any) => Observable<O> | Promise<O>,
  concurrent?: number,
) => <T>(source: Observable<T>) => {
  return new Observable<O[]>((observer) => {
    const worker = source.pipe(
      map((val: T, index: number) =>
        defer(() => cb(val)).pipe(map((res) => ({ index, res }))),
      ),
      mergeAll(concurrent),
    );

    const output = [] as Array<O>;

    return worker.subscribe(
      ({ index, res }) => {
        output[index] = res;
      },
      (err) => observableThrowError(err),
      () => {
        of(output).subscribe(observer);
      },
    );
  });
};
