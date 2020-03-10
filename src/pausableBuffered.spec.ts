import { expect } from 'chai';
import { BehaviorSubject, interval } from 'rxjs';
import { fakeSchedulers } from 'rxjs-marbles/mocha';
import { take } from 'rxjs/operators';
import * as sinon from 'sinon';
import { pausableBuffered } from './pausableBuffered';

describe('pausableBuffered', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  it(
    `Don't pause while pauser i false`,
    fakeSchedulers(() => {
      const pauser$ = new BehaviorSubject(false);
      const expected = 2;

      let res: number;
      interval(100)
        .pipe(pausableBuffered(pauser$, 1), take(3))
        .subscribe((i) => (res = i));

      clock.tick(10000);

      expect(res).to.deep.equal(expected);
    }),
  );

  it(
    `Pause while pauser is true`,
    fakeSchedulers(() => {
      const pauser$ = new BehaviorSubject(false);
      const expected = 0;

      let res: number;
      interval(100)
        .pipe(pausableBuffered(pauser$, 1), take(3))
        .subscribe((i) => {
          res = i;
          pauser$.next(true);
        });

      clock.tick(10000);

      expect(res).to.deep.equal(expected);
    }),
  );

  afterEach(() => {
    clock.restore();
  });
});
