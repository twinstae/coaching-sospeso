import { OpenFeature } from "@openfeature/server-sdk";
import { flagKeys, serverFlagProvider } from './InMemoryFlagProvider.ts';

await OpenFeature.setProviderAndWait(serverFlagProvider);

const client = OpenFeature.getClient();

export async function getBooleanFlag(
  key: keyof typeof flagKeys,
  fallback: boolean,
) {
  return client.getBooleanValue(key, fallback);
}
