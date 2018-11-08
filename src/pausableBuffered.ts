import { Observable, Subject } from 'rxjs';
import { buffer, switchMap, take } from 'rxjs/operators';

/**
 * Buffer the last {bufferCount} values while the pauser is true and emit them once it becomes false.
 */
export const pausableBuffered = (pauser: Observable<boolean>, bufferCount?: number) => <T>(source: Observable<T>) => {
  const subject = new Subject();

  let tmp = source.pipe(buffer(pauser));

  if (bufferCount !== void 0) {
    tmp = tmp.pipe(take(bufferCount));
  }

  tmp.subscribe(subject);

  return pauser.pipe(switchMap((paused) => (paused ? subject : source)));
};
