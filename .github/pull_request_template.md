# Pull Request

## Title Checklist

Before submitting, make sure the PR title is clear and meaningful.

Examples:

- `feat(button): add loading state`
- `fix(dialog): prevent focus escape`
- `docs(theme): update token usage guide`
- `test(table): add sorting test coverage`

PR title should include:

- Type of change
- Affected component/module
- Short summary of the change

---

## Description

### What changed?

<!-- Explain the change clearly. What was added, fixed, removed, or refactored? -->



### Why was this change needed?

<!-- Explain the reason, bug, requirement, or design decision behind this PR. -->



### Notes for reviewers

<!-- Mention anything reviewers should pay special attention to. -->



---

## Components / Areas Affected

<!-- List all affected components, primitives, utilities, docs, or packages. -->

- [ ] Component:
- [ ] Primitive:
- [ ] CDK / utility:
- [ ] Theme / tokens:
- [ ] Icons:
- [ ] Docs:
- [ ] Tests:
- [ ] Build / tooling:
- [ ] Other:

Affected items:

```txt
Example:
- tng-button
- tng-dialog
- focus-trap utility
- theme-default tokens
```

---

## Type of Change

- [ ] Feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Documentation update
- [ ] Test update
- [ ] Accessibility improvement
- [ ] Performance improvement
- [ ] Breaking change
- [ ] Build / tooling change
- [ ] Other:

---

## Test Cases Executed

<!-- List the test cases you executed manually or through automation. -->

### Automated Tests

```txt
Example:
- yarn test button
- yarn nx test components
- yarn lint
- yarn build
```

Executed:

```txt

```

### Manual Test Cases

| # | Test Case | Result |
|---|----------|--------|
| 1 |  | Pass / Fail |
| 2 |  | Pass / Fail |
| 3 |  | Pass / Fail |

---

## Test Evidence / Screenshots

<!-- Upload screenshots, screen recordings, terminal output, or CI evidence. -->

### UI Screenshots

Before:

<!-- Add screenshot if relevant -->

After:

<!-- Add screenshot if relevant -->

### Test Pass Evidence

<!-- Add screenshot of test result, terminal output, or CI result. -->

```txt
Paste test output here if useful.
```

---

## Accessibility Checklist

- [ ] Keyboard navigation verified
- [ ] Focus behavior verified
- [ ] ARIA attributes verified
- [ ] Screen reader labels / names verified where applicable
- [ ] Disabled state behavior verified
- [ ] No unnecessary `tabindex` added
- [ ] No keyboard trap introduced
- [ ] Not applicable

---

## Documentation Checklist

- [ ] README updated
- [ ] Component docs updated
- [ ] API docs updated
- [ ] Examples updated
- [ ] Migration guide updated
- [ ] Changelog updated
- [ ] Not applicable

---

## Migration / Breaking Change Notes

Does this PR introduce a breaking change?

- [ ] No
- [ ] Yes

If yes, describe the migration steps:

```txt

```

Breaking change summary:

```txt

```

---

## Build / Package Checklist

- [ ] Project builds successfully
- [ ] No TypeScript errors
- [ ] No lint errors
- [ ] Public exports updated if needed
- [ ] Package entry points updated if needed
- [ ] Versioning impact considered
- [ ] Not applicable

---

## Visual / Styling Checklist

- [ ] Light mode verified
- [ ] Dark mode verified
- [ ] Theme token usage verified
- [ ] Responsive behavior verified
- [ ] No hard-coded colors introduced unless intentional
- [ ] No unwanted global style impact
- [ ] Not applicable

---

## Final Checklist

- [ ] PR title is clear
- [ ] Description is complete
- [ ] Affected components are listed
- [ ] Test cases are listed
- [ ] Test evidence / screenshots uploaded
- [ ] Documentation updated or marked not applicable
- [ ] Migration steps added if relevant
- [ ] Reviewer notes added if needed
