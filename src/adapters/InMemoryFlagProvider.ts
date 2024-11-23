import { InMemoryProvider as ClientInMemoryProvider } from "@openfeature/react-sdk";

export const flagKeys = {
  isFlagOn: "isFlagOn",
};

export const clientFlagProvider = new ClientInMemoryProvider({
  isFlagOn: {
    variants: {
      on: true,
      off: false,
    },
    defaultVariant: "off",
    disabled: false,
  },
});
