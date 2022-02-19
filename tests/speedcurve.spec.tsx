import React from 'react';
import Head from 'next/head';
import { Router } from 'next/router';
import { render } from '@testing-library/react';
import { SpeedCurve } from '../src';

jest.mock('next/head');
jest.mock('next/router');

const HeadMock = jest.mocked(Head);
const RouterMock = jest.mocked(Router);

HeadMock.mockImplementation(({ children }) => (
  <div
    data-testid="head-mock"
  >
    {children}
  </div>
));

type Noop = () => void;

const getRouterCallback = (scope: 'on' | 'off', name: string): Noop => {
  const eventMock = jest.mocked(RouterMock.events[scope]);

  const [, callback] = eventMock.mock.calls.find((call) => call[0] === name) || [];

  if (!callback) {
    throw Error(`No "${scope}" callback found for "${name}".`);
  }

  return callback;
}

describe('SpeedCurve', () => {
  beforeEach(() => {
    window.LUX = {
      addData: jest.fn(),
      forceSample: jest.fn(),
      init: jest.fn(),
      send: jest.fn(),
    };
  });

  it('inserts the scripts', () => {
    const { getByTestId } = render(<SpeedCurve luxId="123" />);
    const scripts = [...getByTestId('head-mock').querySelectorAll('script')];
    const inlineScript = scripts.find((script) => !script.src);
    const externalScript = scripts.find((script) => script.src);

    expect(scripts).toHaveLength(2);
    expect(inlineScript?.textContent).toContain('LUX=');
    expect(externalScript?.src).toBe('https://cdn.speedcurve.com/js/lux.js?id=123');
  });

  it('marks the start of a transition route change start', () => {
    render(<SpeedCurve luxId="123" />);

    const onRouteChangeStart = getRouterCallback('on', 'routeChangeStart');

    expect(window.LUX.init).not.toHaveBeenCalled();

    onRouteChangeStart();

    expect(window.LUX.init).toHaveBeenCalledTimes(1);
  });

  it('marks the end of a transition on route change complete', () => {
    render(<SpeedCurve luxId="123" />);

    const onRouteChangeComplete = getRouterCallback('on', 'routeChangeComplete');

    expect(window.LUX.send).not.toHaveBeenCalled();

    onRouteChangeComplete();

    expect(window.LUX.send).toHaveBeenCalledTimes(1);
  });

  it('cleans up the router event callbacks on unmount', () => {
    const { unmount } = render(<SpeedCurve luxId="123" />);

    unmount();

    expect(getRouterCallback('on', 'routeChangeStart')).toEqual(
      getRouterCallback('off', 'routeChangeStart')
    );

    expect(getRouterCallback('on', 'routeChangeComplete')).toEqual(
      getRouterCallback('off', 'routeChangeComplete')
    );
  });
});
