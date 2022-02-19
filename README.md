# next-speedcurve

[![npm version](https://badge.fury.io/js/next-speedcurve.svg)](https://badge.fury.io/js/next-speedcurve)

[SpeedCurve](https://www.speedcurve.com/) integration for Next.js applications.

## Installation

```
yarn add next-speedcurve
```

## Usage

The `SpeedCurve` component will inject the SpeedCurve scripts into the document
head and initialize RUM at the beginning of each SPA "page view".

The following example shows this being done via the Next.js
[`App`](https://nextjs.org/docs/advanced-features/custom-app) component:

```jsx
import { SpeedCurve } from 'next-speedcurve';

const MyApp = ({ Component, pageProps }) => (
  <>
    <SpeedCurve
      luxId="123"
    />
    <Component
      {...pageProps}
    />
  </>
);

export default MyApp;
```

## RUM API

The `useSpeedCurveLUX()` hook can be used to interact with the
SpeedCurve RUM JS API, for example:

```jsx
import { useSpeedCurveLUX } from 'next-speedcurve';

useSpeedCurveLUX({
  data: {
    'cart size': 128,
    'experiment A': 'control',
  },
  label: 'my-page',
  samplerate: 20,
});
```

The following properties are available:

| Property | Description |
|----------|-------------|
| `auto`   | If set to false, the beacon is not sent at the window load event.  |
| `data`   | An object containing key value pairs to be added to the beacon. |
| `debug`   | If set to true, debug messages are written to the browser console. |
| `forceSample`   | Calling LUX.forceSample() changes your session cookie so that on all subsequent page views you will be sampled and should see RUM data being generated. |
| `label`   | This is the “page label” used to group RUM data by page type.  |
| `samplerate`   | This is the sample rate for determining whether the beacon is sent.  |

See the [SpeedCurve RUM JS API docs](https://support.speedcurve.com/docs/rum-js-api)
for more details about these properties.
