import { Router } from 'next/router';
import Head from 'next/head';
import React, { useEffect } from 'react';
import { SpeedCurveScripts } from './scripts';

declare global {
  interface Window {
    LUX: {
      addData: Function,
      auto?: boolean;
      debug?: boolean;
      forceSample: Function;
      init: Function;
      label?: string;
      samplerate?: number;
      send: Function;
    };
  }
}

export type SpeedCurveProps = {
  luxId: string | number;
}

/**
 * Handle start of a route change.
 */
const onRouteChangeStart = () => {
  window.LUX.init();
};

/**
 * Handle end of a route change.
 */
const onRouteChangeComplete = () => {
  window.LUX.send();
};

export const SpeedCurve = ({
  luxId,
}: SpeedCurveProps) => {
  useEffect(() => {
    Router.events.on('routeChangeStart', onRouteChangeStart);
    Router.events.on('routeChangeComplete', onRouteChangeComplete);

    return () => {
      Router.events.off('routeChangeStart', onRouteChangeStart);
      Router.events.off('routeChangeComplete', onRouteChangeComplete);
    };
  }, []);

  return (
    <Head>
      <SpeedCurveScripts
        luxId={luxId}
      />
    </Head>
  );
};
