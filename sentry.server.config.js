import * as Sentry from "@sentry/astro";

import.meta.env.PROD && Sentry.init({
  dsn: "https://6e899b9ae9fb445693112299c2c64fcc@glitchtip.life-lifter.com/1",
  tracesSampleRate: 1.0,

  // sentry가 쓰는 import in the middle 이 drizzle과 이슈가 있어서 일단 instrument를 비활성화함
  // https://docs.sentry.io/platforms/javascript/guides/node/troubleshooting/#error-import-in-the-middle-failed-to-wrap
  // https://docs.sentry.io/platforms/javascript/guides/node/troubleshooting/#error-import-in-the-middle-failed-to-wrap
  registerEsmLoaderHooks: false, 
});
