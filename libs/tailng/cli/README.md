<div align="center">
  <img
    src="https://raw.githubusercontent.com/tailng/tailng-ui/main/apps/tailng-ui/docs/src/assets/logo.svg"
    width="96"
    alt="TailNG logo"
  />
</div>

# tailng

TailNG command line utility.

## Commands

```bash
tailng list
tailng add button --cwd apps/tailng-ui/playground-vanilla
tailng add dialog --cwd apps/tailng-ui/playground-vanilla
tailng add popover --cwd apps/tailng-ui/playground-vanilla
tailng add slide-toggle --cwd apps/tailng-ui/playground-vanilla
```

## Options

- `--cwd <path>` target project root (defaults to current working directory)
- `--dry-run` print file operations without writing files
- `--force` overwrite existing files

## Canonical Names

TailNG keeps one canonical component per pattern and resolves common aliases:

- `slide-toggle` -> `switch`
- `sidenav` -> `drawer`
- `sidebar` -> `drawer`
- `side-nav` -> `drawer`
- `sheet` -> `drawer`
- `expansion-panel` -> `accordion`
- `spinner` -> `progress-spinner`
