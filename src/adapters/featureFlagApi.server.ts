// import { startUnleash } from "unleash-client";
// import { secretEnv } from "./env.secret";
import { isProd } from "./env.public";

// const unleashServerPromise = startUnleash({
//   url: "https://unleash.life-lifter.com/api",
//   appName: "coaching-sospeso-server",
//   customHeaders: { Authorization: secretEnv.SECRET_UNLEASH_TOKEN },
// });

type FlagKeys = "isFlagOn";

export type FeatureFlagServerApiI = {
  getIsEnabled(key: FlagKeys): Promise<boolean>;
};

// const unleashFeatureFlagServerApi = {
//   getIsEnabled: async (key) => {
//     return unleashServerPromise
//       .then((unleashServer) => {
//         return unleashServer.isEnabled(key);
//       })
//       .catch(() => false);
//   },
// } satisfies FeatureFlagServerApiI;

const fakeFeatureFlagServerApi = {
  getIsEnabled: async (_key) => {
    return true;
  },
} satisfies FeatureFlagServerApiI;

export const featureFlagServerApi: FeatureFlagServerApiI = fakeFeatureFlagServerApi;
