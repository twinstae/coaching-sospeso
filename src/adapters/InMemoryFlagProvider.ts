import { InMemoryProvider as ServerInMemoryProvider } from '@openfeature/server-sdk';
import { InMemoryProvider as ClientInMemoryProvider } from '@openfeature/react-sdk';

export const flagKeys = {
  isFlagOn: "isFlagOn",
};

export const serverFlagProvider = new ServerInMemoryProvider({
    isFlagOn: {
      variants: {
        on: true,
        off: false,
      },
      defaultVariant: "off",
      disabled: false,
    },
  })

export const clientFlagProvider = new ClientInMemoryProvider({
  isFlagOn: {
    variants: {
      on: true,
      off: false,
    },
    defaultVariant: "off",
    disabled: false,
  },
})