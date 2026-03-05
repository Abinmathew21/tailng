# TailNG Drawer / Sidenav — Full Test Set (v1 Lock)

> One-line, self-explanatory test titles grouped by category.  
> Assumes primitives: `tng-drawer-container`, `tng-drawer`, `tng-drawer-content` (optional aliases `tng-sidenav-*`).

---

## A) Exports & basic structure
- [x] Exports the drawer-container primitive
- [x] Exports the drawer primitive
- [x] Exports the drawer-content primitive
- [x] Renders a single drawer-content region linked to the container
- [x] Supports multiple drawers inside one container (start/end)
- [x] Fails safely when drawer is used outside a container
- [x] Fails safely when multiple drawer-content elements are declared in one container (if disallowed)

---

## B) ARIA & accessibility attributes
- [x] Applies the configured `role` on the drawer host
- [x] Preserves consumer-provided `aria-label` and `aria-labelledby` on the drawer
- [x] Applies `aria-modal="true"` when role is `dialog` and overlay mode is open (if implemented)
- [x] Does not apply `aria-modal` when role is not `dialog` or drawer is closed
- [x] Drawer host exposes state attributes (`data-open`, `data-mode`, `data-position`) when implemented
- [x] Backdrop is marked as presentational/non-focusable and does not receive tab focus

---

## C) Controlled vs uncontrolled state
- [x] Respects controlled `opened=true` on initial render
- [x] Respects controlled `opened=false` on initial render
- [x] Respects `defaultOpened=true` only when `opened` is not provided
- [x] Does not mutate consumer-controlled `opened` state internally
- [x] Emits `openedChange` only on user/imperative interactions (not on initial render)

---

## D) Public methods & idempotency
- [x] `open()` opens the drawer and updates state deterministically
- [x] `close()` closes the drawer and updates state deterministically
- [x] `toggle()` opens when closed and closes when open
- [x] `toggle(true)` forces open and is idempotent when already open
- [x] `toggle(false)` forces close and is idempotent when already closed
- [x] Repeated `open()` calls while open do not re-emit lifecycle events
- [x] Repeated `close()` calls while closed do not re-emit lifecycle events

---

## E) Mode semantics (overlay / push / side)
- [x] In `overlay` mode, drawer overlays content without shifting content
- [x] In `push` mode, opening drawer shifts content by drawer width
- [x] In `side` mode, opening drawer consumes layout space and content reflows beside it
- [x] Switching mode at runtime recomputes layout without breaking open state (if supported)
- [x] `overlay` mode uses backdrop by default when `backdrop='auto'`
- [x] `push` mode does not use backdrop by default when `backdrop='auto'`
- [x] `side` mode does not use backdrop by default when `backdrop='auto'`

---

## F) Positioning (start/end) & RTL correctness
- [x] In LTR, `position='start'` anchors the drawer to the left
- [x] In LTR, `position='end'` anchors the drawer to the right
- [x] In RTL, `position='start'` anchors the drawer to the right
- [x] In RTL, `position='end'` anchors the drawer to the left
- [x] Runtime direction change LTR→RTL while open recomputes effective side without closing (if supported)
- [x] Runtime direction change RTL→LTR while open recomputes effective side without closing (if supported)
- [x] Runtime direction change updates push/side content offsets correctly (if supported)

---

## G) Backdrop & outside interaction
- [x] Backdrop is created when open and backdrop is enabled
- [x] Backdrop is not created when closed
- [x] Backdrop is not created when `backdrop=false`
- [x] Backdrop click emits `backdropClick` event when open
- [x] Outside pointerdown closes the drawer when `closeOnOutsideClick=true` in overlay mode
- [x] Outside pointerdown does not close the drawer when `closeOnOutsideClick=false`
- [x] Backdrop click does not close when `closeOnOutsideClick=false` but still emits `backdropClick`
- [x] Pointerdown inside drawer does not close the drawer
- [x] Pointerdown inside content does not close the drawer when the pointerdown target is within container bounds (if applicable)
- [x] Outside dismiss uses pointerdown-based logic (not click-only) for consistent behavior

---

## H) Escape & keyboard close behavior
- [x] Pressing Escape closes when `closeOnEscape=true` and drawer is open
- [x] Pressing Escape does not close when `closeOnEscape=false`
- [x] Pressing Escape does nothing when the drawer is already closed
- [x] Escape close emits close lifecycle events in deterministic order

---

## I) Focus management (autoFocus / restoreFocus / trapFocus / inert)
- [x] On open, autoFocus moves focus to the drawer host when `autoFocus='drawer'`
- [x] On open, autoFocus moves focus to the first focusable element when `autoFocus='first-focusable'`
- [x] On open, autoFocus does not move focus when `autoFocus='none'`
- [x] On Escape close, focus restores to the trigger/restore target when `restoreFocus=true`
- [x] On Escape close, focus is not restored when `restoreFocus=false`
- [x] When restore target is removed while open, focus restores to the configured fallback target on close
- [x] Closing via Tab does not force focus restore and allows native focus movement (if you support Tab-close semantics)
- [x] When `trapFocus='auto'` in overlay mode, focus is trapped within the drawer while open
- [x] When `trapFocus=false`, focus is not trapped and Tab moves normally
- [x] When `inertContent='auto'` in overlay mode, underlying content becomes inert/non-interactive while open
- [x] When `inertContent=false`, underlying content remains interactive even with backdrop (if you allow this)
- [x] Focus trap is released reliably on close (no stuck focus cycle)

---

## J) Tab behavior (if you choose “close on Tab” policy)
- [x] Pressing Tab closes the overlay drawer and allows native focus movement (if enabled)
- [x] Pressing Shift+Tab closes the overlay drawer and allows native focus movement (if enabled)
- [x] Tab keydown close path does not call `preventDefault()` (if enabled)
- [x] Shift+Tab keydown close path does not call `preventDefault()` (if enabled)

---

## K) Lifecycle events & ordering (animated vs non-animated)
- [x] openStart fires before opened in animated mode
- [x] closeStart fires before closed in animated mode
- [x] openStart and opened fire in deterministic order when `animate=false`
- [x] closeStart and closed fire in deterministic order when `animate=false`
- [x] opened/closed do not fire without corresponding start events
- [x] start events fire exactly once per transition
- [x] opened/closed fire exactly once per transition
- [x] Rapid open→close preserves correct event ordering and final state

---

## L) Animation & transition completion
- [x] `opened` fires on transition/animation completion when `animate=true`
- [x] `closed` fires on transition/animation completion when `animate=true`
- [x] Transition-end handling ignores unrelated transition events from nested elements
- [x] Transition-end handling works when drawer width changes mid-animation (if supported)

---

## M) Scroll & viewport policies (overlay UX)
- [x] Overlay mode locks body scroll when `lockScroll='auto'` (or `lockScroll=true`)
- [x] Overlay mode does not lock body scroll when `lockScroll=false`
- [x] Side mode does not lock body scroll by default
- [x] Push mode does not lock body scroll by default
- [ ] Drawer closes on window resize/scroll if policy is enabled (if implemented)
- [x] Drawer remains open on resize/scroll if policy is disabled (if implemented)

---

## N) Multiple drawers in one container (coordination)
- [x] Allows one start and one end drawer in the same container (if supported)
- [x] With `closeOthersOnOpen=true`, opening start closes open end
- [x] With `closeOthersOnOpen=true`, opening end closes open start
- [x] With `closeOthersOnOpen=false`, both drawers can remain open
- [x] With both open in push/side, content offsets compute deterministically (if supported)
- [x] Backdrop policy is deterministic when both drawers are open (if supported)

---

## O) Dynamic lifecycle (add/remove/re-render)
- [x] Removing an open drawer closes it and emits close events deterministically
- [x] Removing drawer-content while drawer is open resets container state safely
- [x] Removing container while drawer is open cleans up global listeners safely
- [x] Re-rendering drawer element preserves open state and does not leak listeners
- [x] Re-rendering container preserves drawer association and state (if supported)
- [x] Replacing the restoreFocus target while open updates the stored reference (if supported)

---

## P) Cleanup & memory safety
- [x] Removes global pointerdown listener when drawer closes
- [x] Removes global pointerdown listener when container is destroyed while open
- [ ] Removes scroll/resize listeners when container is destroyed (if used)
- [x] Releases focus trap resources on destroy (no retained references)
- [x] Does not leave stale `data-open`/ARIA state after teardown

---

## Q) Disabled state behavior
- [x] Disabled drawer cannot be opened by user interaction
- [x] Disabled drawer ignores `open()` calls (or opens only programmatically) per contract
- [x] Disabled drawer still closes when `close()` is called programmatically (per contract)
- [x] Disabled state is reflected via `aria-disabled="true"` when applicable (if you choose to apply it)

---

## R) Sidenav (viewport-fixed) features (if included)
- [x] `fixedInViewport=true` positions drawer relative to viewport instead of container flow
- [x] `fixedTopGap` offsets the fixed drawer from the top correctly
- [x] `fixedBottomGap` offsets the fixed drawer from the bottom correctly
- [ ] Fixed viewport gaps recompute on window resize (if supported)
- [x] Fixed viewport mode does not break push/side layout computations (if supported)

---

## S) Edge cases & resilience
- [x] Opening without an associated trigger does not throw and still behaves correctly
- [x] Closing without an associated trigger does not throw and still behaves correctly
- [x] Opening when container is display:none does not crash (fails safely)
- [x] Drawer width changes while open recompute content offset correctly in push/side
- [x] Backdrop remains visible when open even if closeOnOutsideClick is false (if configured)
- [x] Pointerdown on scrollbar does not cause spurious close (if applicable to your environment)

---

## T) Optional gesture (swipe) tests (v1.1+ if enabled)
- [x] Swipe-to-close is disabled by default
- [x] Swipe-to-close works only in overlay mode (if locked)
- [x] Swipe gesture does not interfere with vertical scroll in drawer content
- [x] Swipe-to-close respects RTL effective side mapping
- [x] Swipe-to-close emits closeStart→closed in deterministic order

---
