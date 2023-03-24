import { Observable, throwError, timer } from 'rxjs';
import { delayWhen, retryWhen } from 'rxjs/operators';

/**
 * Retry with delay, useful for HTTP requests that might fail temporarily
 */
export const retryWithDelay =
  (maxRetries = 3, delay = 100) =>
  <T>(source: Observable<T>) => {
    let retries = 0;

    return source.pipe(
      retryWhen((errors) =>
        errors.pipe(
          delayWhen((val) => {
            retries += 1;
            if (retries >= maxRetries) {
              return throwError(val);
            }

            return timer(delay);
          }),
        ),
      ),
    );
  };
