import { expect } from 'chai';
import { BehaviorSubject } from 'rxjs';
import { getObservableValue } from './getObservableValue';

describe('getObservableValue', () => {
  it('Get value from BehaviorSubject', () => {
    const value = 1000;
    const value$ = new BehaviorSubject(value);

    expect(getObservableValue(value$)).to.be.equal(value);
  });

  it('No crash on invalid observable', () => {
    const value$ = null;

    expect(getObservableValue(value$)).to.be.undefined;
  });
});
