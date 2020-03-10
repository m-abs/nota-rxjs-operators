import { expect } from 'chai';
import { BehaviorSubject } from 'rxjs';
import { mapFromBoolean } from './mapFromBoolean';

describe('mapFromBoolean', () => {
  const trueValue = 'TRUE';
  const falseValue = 'FALES';

  it('true / false', () => {
    let result: string;
    const bs = new BehaviorSubject(false);
    bs.pipe(mapFromBoolean(trueValue, falseValue)).subscribe((r) => (result = r));

    expect(result).be.equal(falseValue);
    bs.next(true);
    expect(result).be.equal(trueValue);

    bs.unsubscribe();
  });

  it('Truphy value', () => {
    let result: string;
    const bs = new BehaviorSubject(false);
    bs.pipe(mapFromBoolean(trueValue, falseValue)).subscribe((r) => (result = r));

    expect(result).be.equal(falseValue);

    for (const v of [' ', 1, {}, []]) {
      bs.next(v as any);
      expect(result).be.equal(trueValue);
    }

    bs.unsubscribe();
  });

  it('Falsy value', () => {
    let result: string;
    const bs = new BehaviorSubject(true);
    bs.pipe(mapFromBoolean(trueValue, falseValue)).subscribe((r) => (result = r));

    expect(result).be.equal(trueValue);

    for (const v of [0, '', null, undefined]) {
      bs.next(v as any);
      expect(result).be.equal(falseValue);
    }

    bs.unsubscribe();
  });
});
