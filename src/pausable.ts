import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/never';
import 'rxjs/add/operator/switchMap';

/**
 * Skip value updates while the pauser have a true value
 */
export function pausable<T>(this: Observable<T>, pauser: Observable<boolean>): Observable<T> {
  return pauser.switchMap((paused) => paused ? Observable.never() : this);
}

Observable.prototype.pausable = pausable;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    /**
     * Skip value updates while the pauser have a true value
     */
    pausable: typeof pausable;
  }
}
