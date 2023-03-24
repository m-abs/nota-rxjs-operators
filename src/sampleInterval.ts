import { interval, Observable } from 'rxjs';
import { sample } from 'rxjs/operators';

/**
 * Sample e.g. re-emit value every {intervalTime} ms
 */
export const sampleInterval =
  (intervalTime: number) =>
  <T>(source: Observable<T>) =>
    source.pipe(sample(interval(intervalTime)));
