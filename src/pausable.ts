import { never, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

/**
 * Skip value updates while the pauser have a true value
 */
export const pausable = (pauser: Observable<boolean>) => <T>(source: Observable<T>) => pauser.pipe(switchMap((paused) => (paused ? never() : source)));
