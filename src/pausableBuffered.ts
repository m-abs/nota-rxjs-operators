import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/from';

/**
 * Buffer the last {bufferCount} values while the pauser is true and emit them once it becomes false.
 */
export function pausableBuffered<T>(this: Observable<T>, pauser: Observable<boolean>, bufferSize: number = 1): Observable<T> {
  return new Observable((subscriber) => {
    let isEnabled = false;
    const closeBuffer = new Subject();
    const bufferIn = new Subject<T>();

    const bufferSubscript = bufferIn
      .buffer(closeBuffer)
      .bufferCount(bufferSize)
      .switchMap((values) => Observable.from(values))
      .subscribe((values) => {
        values.forEach((val) => subscriber.next(val));
      });

    const pauserSubcription = pauser.subscribe((pause) => {
      isEnabled = pause;
      if (isEnabled) {
        // flush buffer every when stream is enabled
        closeBuffer.next(0);
      }
    });

    const subscription = this.subscribe((value) => {
        try {
          if (isEnabled) {
            subscriber.next(value);
          } else {
            bufferIn.next(value);
          }
        } catch(err) {
          subscriber.error(err);
        }
      },
      (err) => subscriber.error(err),
      () => subscriber.complete());

    return () => {
      subscription.unsubscribe();
      bufferSubscript.unsubscribe();
      pauserSubcription.unsubscribe();
    };
  });
}

declare module 'rxjs/Observable' {
  interface Observable<T> {
    /**
     * Buffer the last {bufferCount} values while the pauser is true and emit them once it becomes false.
     */
    pausableBuffered: typeof pausableBuffered;
  }
}
