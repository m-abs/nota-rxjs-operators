import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Take the current value of an observable.
 * Like .value on a BehaviorSubject.
 */
export function getObservableValue<T>(observable: Observable<T>): T {
  if (observable instanceof BehaviorSubject) {
    return observable.value;
  }

  let result: T;
  observable.pipe(take(1)).subscribe((value) => (result = value));
  return result;
}
