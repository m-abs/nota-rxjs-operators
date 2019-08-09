import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { take } from 'rxjs/operators';

/**
 * Take the current value of an observable.
 * Like .value on a BehaviorSubject.
 */
export function getObservableValue<T>(obs: Observable<T>): T {
  if (!obs || !(obs instanceof Observable)) {
    return;
  }

  if (obs instanceof BehaviorSubject) {
    return obs.value;
  }

  let result: T;
  obs.pipe(take(1)).subscribe((value) => (result = value));
  return result;
}
