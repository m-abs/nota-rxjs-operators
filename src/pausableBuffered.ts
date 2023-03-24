import { Observable, Subject } from 'rxjs';
import { buffer, switchMap, take } from 'rxjs/operators';

/**
 * Buffer the last {bufferCount} values while the pauser is true and emit them once it becomes false.
 */
export const pausableBuffered =
  (pauser: Observable<boolean>, bufferCount?: number) =>
  <T>(source: Observable<T>): Observable<T> => {
    const subject = new Subject<T>();

    let tmp = source.pipe(buffer(pauser));

    if (bufferCount !== void 0) {
      tmp = tmp.pipe(take(bufferCount));
    }

    tmp.subscribe(subject as any);

    return pauser.pipe(
      switchMap((paused) => {
        if (paused) {
          return subject;
        }

        return source;
      }),
    );
  };
