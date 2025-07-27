/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

// Re-export lit-html functionality with proper TypeScript types
export { html, svg, render, noChange, nothing } from "lit-html";

export type {
  TemplateResult,
  SVGTemplateResult,
  RenderOptions,
  TemplateResult as Template,
} from "lit-html";
