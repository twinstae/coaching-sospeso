import invariant from "@/invariant.ts";
import * as v from "valibot";

export type SafeEventBus<DetailT> = {
  dispatch(element: HTMLElement | undefined, detail: DetailT): void;
  on(
    element: HTMLElement,
    callback: (detail: DetailT) => void | Promise<void>,
  ): void;
};

export function createSafeEvent<
  SchemaT extends v.ObjectSchema<
    {
      [key: string]: v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;
    },
    undefined
  >,
  DetailT extends v.InferOutput<SchemaT>,
>(name: string, _schema: SchemaT): SafeEventBus<DetailT> {
  return {
    dispatch(element: HTMLElement | undefined, detail: DetailT) {
      invariant(element, "element가 존재하지 않습니다!");
      element.dispatchEvent(
        new CustomEvent(name, {
          detail,
          bubbles: true,
        }),
      );
    },
    on(
      element: HTMLElement,
      callback: (detail: DetailT) => void | Promise<void>,
    ) {
      element.addEventListener(name, (event: Event) => {
        if (event instanceof CustomEvent && event.type === name) {
          callback(event.detail);
        }
      });
    },
  };
}
