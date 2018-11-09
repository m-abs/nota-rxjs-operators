import { expect } from 'chai';
import { Observable, of, timer } from 'rxjs';
import { fakeSchedulers } from 'rxjs-marbles/mocha';
import { map } from 'rxjs/operators';
import * as sinon from 'sinon';
import { retryWithDelay } from './retryWithDelay';

describe('retryWithDelay', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  it(
    `Shouldn't prevent sucess w/o error`,
    fakeSchedulers(() => {
      const input = [1, 2, 3, 4, 5];
      const output = input.map((v) => v * 2);

      const res = [] as number[];
      of(...input)
        .pipe(retryWithDelay())
        .subscribe((value) => res.push(value * 2));

      clock.tick(100);

      expect(res).to.deep.equal(output);
    }),
  );

  it(
    `Shouldn't prevent sucess with temp error`,
    fakeSchedulers(() => {
      const input = [1, 2, 3, 4, 5];
      const output = input.map((v) => v * 2);

      const res = [] as number[];
      let triggerError = false;
      new Observable<number[]>((observer) => {
        observer.next(input);

        observer.complete();
        return observer;
      })
        .pipe(
          map((items) => {
            if (!triggerError) {
              triggerError = true;
              throw new Error();
            }

            return items.map((v) => v * 2);
          }),
          retryWithDelay(),
        )
        .subscribe((items) => res.push(...items));

      clock.tick(100);

      expect(res).to.deep.equal(output);
    }),
  );

  it(
    `Should stop retrying if max reached`,
    fakeSchedulers(() => {
      const input = [1, 2, 3, 4, 5];

      let res: boolean;
      let numTriggerError = 0;
      let maxRetries = 2;

      let failed = false;
      new Observable<number[]>((observer) => {
        observer.next(input);

        observer.complete();
        return observer;
      })
        .pipe(
          map((items) => {
            if (numTriggerError < maxRetries) {
              numTriggerError += 1;
              throw new Error();
            }

            return items.map((v) => v * 2);
          }),
          retryWithDelay(maxRetries),
        )
        .subscribe(null, (err) => (res = true));

      clock.tick(100);

      expect(res).to.equal(true);
    }),
  );

  afterEach(() => {
    clock.restore();
  });
});
