import * as isEqual from 'fast-deep-equal';
import { Observable } from 'rxjs/internal/Observable';
import { distinctUntilChanged } from 'rxjs/operators';

export const distinctUntilDeepChanged = () => <T>(source: Observable<T>): Observable<T> =>
  source.pipe(distinctUntilChanged((a, b) => a === b || isEqual(a, b)));
