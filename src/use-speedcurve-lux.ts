import { useEffect } from 'react';

export type SpeedCurveLuxOptions = {
  auto?: boolean;
  data?: object;
  debug?: boolean;
  forceSample?: boolean;
  label?: string;
  samplerate?: number;
};

/**
 * A hook for interacting with the SpeedCurve RUM JavaScript API.
 */
export const useSpeedCurveLUX = ({
  auto,
  data,
  debug,
  forceSample,
  label,
  samplerate,
}: SpeedCurveLuxOptions = {}) => {
  useEffect(() => {
    window.LUX = window.LUX || {};

    if (auto) {
      window.LUX.auto = auto;
    }

    if (debug) {
      window.LUX.debug = debug;
    }

    if (label) {
      window.LUX.label = label;
    }

    if (samplerate) {
      window.LUX.samplerate = samplerate;
    }

    if (forceSample) {
      window.LUX.forceSample();
    }

    Object.entries(data || {}).forEach(([key, value]) => {
      window.LUX.addData(key, value);
    });
  }, []);
};
