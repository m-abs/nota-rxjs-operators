import { AsyncSubject, Observable, throwError, timer } from 'rxjs';

/**
 * Cache data for a limited period of time.
 * This is useful for observable that are used often, but needs to be refreshed after a while.
 */
export const cacheWithExpiration =
  (expirationMs: number) =>
  <T>(source: Observable<T>) => {
    let cachedData: AsyncSubject<T>;
    return new Observable<T>((observer) => {
      if (!cachedData) {
        cachedData = new AsyncSubject<T>();

        source.subscribe(cachedData);

        cachedData.subscribe(
          () => {
            timer(expirationMs).subscribe(() => (cachedData = undefined));
          },
          (err) => throwError(err),
        );
      }

      return cachedData.subscribe(observer);
    });
  };
