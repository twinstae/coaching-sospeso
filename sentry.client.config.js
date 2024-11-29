import * as Sentry from "@sentry/astro";

import.meta.env.PROD && Sentry.init({
  dsn: "https://6e899b9ae9fb445693112299c2c64fcc@glitchtip.life-lifter.com/1",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.01,
});
