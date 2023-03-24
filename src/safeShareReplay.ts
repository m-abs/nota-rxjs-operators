import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

export const safeShareReplay =
  (bufferSize = 1, refCount = true) =>
  <T>(source: Observable<T>) =>
    source.pipe(
      shareReplay({
        bufferSize,
        refCount,
      }),
    );
