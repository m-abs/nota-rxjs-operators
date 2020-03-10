import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';

/**
 * Map any truphy value to either trueValue or falseValue
 *
 * @param trueValue
 * @param falseValue
 */
export const mapFromBoolean = <T, T2>(trueValue: T, falseValue: T2) => (source: Observable<any>): Observable<T | T2> =>
  source.pipe(map((input) => (input ? trueValue : falseValue)));
