import { expect } from 'chai';
import { of, timer } from 'rxjs';
import { fakeSchedulers } from 'rxjs-marbles/mocha';
import { map } from 'rxjs/operators';
import * as sinon from 'sinon';
import { concurrentMerge } from './concurrentMerge';

describe('concurrentMerge', () => {
  let clock: sinon.SinonFakeTimers;

  beforeEach(() => {
    clock = sinon.useFakeTimers();
  });

  it(
    'Return in proper order',
    fakeSchedulers(() => {
      const input = [1, 2, 3, 4, 5];
      const output = input.map((v) => v * 2);

      let res: number[];
      of(...input)
        .pipe(concurrentMerge((val) => timer(100 * Math.random() * val).pipe(map(() => val * 2))))
        .subscribe((value) => (res = value));

      clock.tick(10000);

      expect(res).to.deep.equal(output);
    }),
  );

  it(
    'Handle error',
    fakeSchedulers(() => {
      const input = [1, 2, 3, 4, 5];
      let expected = true;

      let gotError = false;
      of(...input)
        .pipe(
          concurrentMerge((val) =>
            timer(100 * Math.random() * val).pipe(
              map(() => {
                if (val === 3) {
                  throw new Error();
                }
                val * 2;
              }),
            ),
          ),
        )
        .subscribe(null, () => (gotError = true));

      clock.tick(1000);

      expect(gotError).to.equal(expected);
    }),
  );

  afterEach(() => {
    clock.restore();
  });
});
