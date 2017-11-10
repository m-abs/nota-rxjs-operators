import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/throw';

/**
 * Cache data for a limited period of time.
 * This is useful for observable that are used often, but needs to be refreshed after a while.
 */
export function cacheWithExpiration<T>(this: Observable<T>, expirationMs: number): Observable<T> {
  let cachedData: AsyncSubject<T>;
  return new Observable<T>((observer) => {
    if (!cachedData) {
      cachedData = new AsyncSubject<T>();

      this.subscribe(cachedData);

      cachedData.subscribe(() => {
        Observable.timer(expirationMs).subscribe(() => cachedData = undefined);
      }, (err) => {
        Observable.throw(err);
      });
    }

    cachedData.subscribe(observer);
  });
}

Observable.prototype.cacheWithExpiration = cacheWithExpiration;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    /**
     * Cache data for a limited period of time.
     * This is useful for observable that are used often, but needs to be refreshed after a while.
     */
    cacheWithExpiration: typeof cacheWithExpiration;
  }
}
