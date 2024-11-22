import type { ComponentType } from "react";
import { clientFlagProvider, type flagKeys } from "./InMemoryFlagProvider";
import {
  OpenFeature,
  OpenFeatureProvider,
  useBooleanFlagValue,
} from "@openfeature/react-sdk";

await OpenFeature.setProviderAndWait(clientFlagProvider);

export function withOpenFeature<PropsT extends {}>(
  Component: ComponentType<PropsT>,
): ComponentType<PropsT> {
  const WrappedComponent: ComponentType<PropsT> = (props) => {
    return (
      <OpenFeatureProvider>
        <Component {...props} />
      </OpenFeatureProvider>
    );
  };

  WrappedComponent.displayName = Component.displayName;

  return WrappedComponent;
}

export function useBooleanFlag(key: keyof typeof flagKeys, fallback: boolean) {
  return useBooleanFlagValue(key, fallback);
}
