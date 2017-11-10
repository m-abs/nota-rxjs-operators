import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/retryWhen';

/**
 * Retry with delay, useful for HTTP requests that might fail temporarily
 */
export function retryWithDelay<T>(this: Observable<T>, maxRetries = 3, delay = 100): Observable<T> {
  let retries = 0;

  return this.retryWhen((errors) => errors.delayWhen((val) => {
    retries += 1;
    if (retries >= maxRetries) {
      return Observable.throw(val);
    }

    return Observable.timer(delay);
  }));
}
