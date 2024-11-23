/// <reference path="../.astro/types.d.ts" />

declare namespace App {
  interface Locals {
    user?: {
      id: string;
      nickname: string;
      role: "user" | "admin";
    };
    now: Date;
  }
}

interface ImportMetaEnv {}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
