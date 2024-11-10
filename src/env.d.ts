/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    session?: {
      name: string;
    };
  }
}

interface ImportMetaEnv {

}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
