import { renderHook } from '@testing-library/react-hooks';
import { useSpeedCurveLUX } from '../src';

type LUXProps = 'auto' | 'debug' | 'label' | 'samplerate';

describe('useSpeedCurveLUX', () => {
  beforeEach(() => {
    window.LUX = {
      addData: jest.fn(),
      forceSample: jest.fn(),
      init: jest.fn(),
      send: jest.fn(),
    };
  });

  describe.each<[LUXProps, boolean | string | number]>([
    ['auto', true],
    ['debug', true],
    ['label', 'my page'],
    ['samplerate', 20],
  ])('%s', (key, value) => {
    it('sets the property if a value is given', () => {
      renderHook(() => useSpeedCurveLUX({ [key]: value }));

      expect(window.LUX[key]).toBe(value);
    });

    it('sets the property if a value is given and window.LUX is undefined', () => {
      delete (window as any).LUX;

      renderHook(() => useSpeedCurveLUX({ [key]: value }));

      expect(window.LUX[key]).toBe(value);
    });

    it('does not set the property if a value is not given', () => {
      renderHook(() => useSpeedCurveLUX());

      expect(window.LUX[key]).toBeUndefined();
    });
  });

  describe('forceSample', () => {
    it('calls the function if the relevant flag is given', () => {
      renderHook(() => useSpeedCurveLUX({ forceSample: true }));

      expect(window.LUX.forceSample).toHaveBeenCalledTimes(1);
    });

    it('does not call the function if no flag is given', () => {
      renderHook(() => useSpeedCurveLUX());

      expect(window.LUX.forceSample).not.toHaveBeenCalled();
    });
  });

  describe('data', () => {
    it('adds the given data', () => {
      renderHook(() => useSpeedCurveLUX({
        data: {
          'cart size': 128,
          'experiment A': 'control',
        },
      }));

      expect(window.LUX.addData).toHaveBeenCalledTimes(2);
      expect(window.LUX.addData).toHaveBeenCalledWith('cart size', 128);
      expect(window.LUX.addData).toHaveBeenCalledWith('experiment A', 'control');
    });

    it('does not attempt to add any data if none given', () => {
      renderHook(() => useSpeedCurveLUX());

      expect(window.LUX.addData).not.toHaveBeenCalled();
    });
  });
});
