import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/sample';

/**
 * Sample e.g. re-emit value every {intervalTime} ms
 */
export function sampleInterval<T>(this: Observable<T>, intervalTime: number): Observable<T> {
  return this.sample(Observable.interval(intervalTime));
}
