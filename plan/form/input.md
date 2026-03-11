# Input

Text input fields, adornments, validation messaging, and layout patterns.

## Overview

The Input component (`tng-input`) wraps a native text control with a consistent layout, optional label and hint, and support for leading/trailing content (icons, buttons, or text).

## Basic usage

- Use `<tng-input>` as the wrapper and `<input tngInput>` (or equivalent control) inside.
- Optional: `label`, `hint`, `required`, and size (`sm` / `md` / `lg`).

## Structure

- **Label** — Optional label text above the control.
- **Hint** — Optional helper or error text below.
- **Leading** — Slot `tngInputLeading` for content before the input (e.g. icon).
- **Trailing** — Slot `tngInputTrailing` for content after the input (e.g. clear button).
- **Control** — The actual `<input>` (or textarea) with directive `tngInput`.

## Accessibility

- Associates label and hint with the control for screen readers.
- Respects `required`, `disabled`, and `aria-*` on the native input.

## Links

- Docs route: `/components/form/input`
