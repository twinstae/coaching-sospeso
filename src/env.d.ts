/// <reference path="../.astro/types.d.ts" />
/// <reference types="vite-plugin-svgr/client" />

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
