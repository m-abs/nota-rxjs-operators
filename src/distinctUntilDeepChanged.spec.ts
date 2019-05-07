import { expect } from 'chai';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilDeepChanged } from './distinctUntilDeepChanged';

describe('distinctUntilDeepChanged', () => {
  it('Same object reference', () => {
    const value = {
      a: 1,
    };

    let numResults = 0;
    const bs = new BehaviorSubject(value);
    bs.pipe(distinctUntilDeepChanged()).subscribe(() => (numResults += 1));

    expect(numResults).be.equal(1);
    bs.next(value);
    expect(numResults).be.equal(1);

    bs.unsubscribe();
  });

  it('Object with same values', () => {
    const value = {
      a: 1,
    };

    let numResults = 0;
    const bs = new BehaviorSubject(value);
    bs.pipe(distinctUntilDeepChanged()).subscribe(() => (numResults += 1));

    bs.next({ ...value });

    expect(numResults).be.equal(1);

    bs.unsubscribe();
  });

  it('Object with changed values', () => {
    let a = 1;
    const value = {
      a,
    };

    let numResults = 0;
    const bs = new BehaviorSubject(value);
    bs.pipe(distinctUntilDeepChanged()).subscribe(() => (numResults += 1));

    expect(numResults).be.equal(1);
    a += 1;
    bs.next({ ...value, a });
    expect(numResults).be.equal(2);
    bs.next({ ...value, a });
    expect(numResults).be.equal(2);

    bs.unsubscribe();
  });

  it('Arrays', () => {
    const values = [0, 1, 10, null, void 0, 'hugo', 'huba', 'hop'];

    let numResults = 0;
    const bs = new BehaviorSubject<any>(values);
    bs.pipe(distinctUntilDeepChanged()).subscribe(() => (numResults += 1));

    expect(numResults).be.equal(1);
    bs.next([...values]);
    expect(numResults).be.equal(1);
    bs.next([...values, 1]);
    expect(numResults).be.equal(2);

    bs.unsubscribe();
  });

  it('Primitives', () => {
    const values = [0, 1, 10, null, void 0, 'hugo', 'huba', 'hop'];

    for (const value of values) {
      let numResults = 0;
      const bs = new BehaviorSubject<any>(value);
      bs.pipe(distinctUntilDeepChanged()).subscribe(() => (numResults += 1));

      expect(numResults).be.equal(1);
      bs.next(value);
      expect(numResults).be.equal(1);
      bs.next([value]);
      expect(numResults).be.equal(2);

      bs.unsubscribe();
    }
  });
});
